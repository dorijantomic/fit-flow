"use server";

import { redirect } from "next/navigation";
import prisma from "./prisma";
import sgMail from "@sendgrid/mail";
import crypto from "crypto";

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export async function loginAction(
  email: string,
  password: string
): Promise<{ error?: string }> {
  const { login } = await import("./auth");
  const result = await login(email, password);
  if (result.error) {
    return { error: result.error };
  }
  redirect("/");
}

export async function registerAction(
  email: string,
  password: string,
  name: string
): Promise<{ error?: string }> {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "An account with this email already exists." };
  }

  const { hashPassword } = await import("./auth");
  const hashedPassword = await hashPassword(password);
  const verificationToken = crypto.randomUUID();

  try {
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          id: crypto.randomUUID(),
          email,
          password: hashedPassword,
          name,
        },
      });

      await tx.emailVerificationToken.create({
        data: {
          id: verificationToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
        },
      });
    });

    // Email sending is outside the transaction. If this fails, the user is still created.
    // This is a trade-off. A more robust system would use a background job queue.
    const verificationLink = `${process.env.BASE_URL}/auth/verify-email?token=${verificationToken}`;
    const msg = {
      to: email,
      from: `${process.env.SENDGRID_FROM_EMAIL}`, // Change to your verified sender
      subject: "Verify your email",
      html: `<p>Click the link to verify your email: <a href="${verificationLink}">${verificationLink}</a></p>`,
    };

    await sgMail.send(msg);
    console.log("Email sent successfully");
  } catch (error) {
    console.error(error);
    return { error: "An unexpected error occurred. Please try again." };
  }
  return {};
}

export async function logoutAction() {
  const { deleteSession } = await import("./session");
  await deleteSession();
  redirect("/login");
}

export async function verifyEmailAction(
  token: string
): Promise<{ error?: string; success?: boolean }> {
  const existingToken = await prisma.emailVerificationToken.findUnique({
    where: { id: token },
  });

  if (!existingToken) {
    return { error: "Invalid verification token." };
  }

  if (new Date() > existingToken.expiresAt) {
    return { error: "Verification token has expired." };
  }

  try {
    await prisma.user.update({
      where: { id: existingToken.userId },
      data: { emailVerified: true },
    });

    await prisma.emailVerificationToken.delete({
      where: { id: token },
    });

    return { success: true };
  } catch (error) {
    return { error: "An unexpected error occurred." };
  }
}

export async function forgotPasswordAction(
  email: string
): Promise<{ error?: string; success?: boolean }> {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    // To prevent email enumeration, we don't reveal if the user exists.
    return { success: true };
  }

  const otp = crypto.randomInt(100000, 999999).toString();
  const tokenId = crypto.randomUUID();

  try {
    await prisma.passwordResetToken.create({
      data: {
        id: tokenId,
        userId: user.id,
        otp,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
      },
    });

    const msg = {
      to: email,
     from: `${process.env.SENDGRID_FROM_EMAIL}`,
      subject: "Your Password Reset Code",
      html: `<p>Your password reset code is: <strong>${otp}</strong>. It will expire in 15 minutes.</p>`,
    };

    await sgMail.send(msg);
    return { success: true };
  } catch (error) {
    return { error: "Failed to send password reset email." };
  }
}

export async function resetPasswordAction(
  email: string,
  otp: string,
  password: string
): Promise<{ error?: string; success?: boolean }> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { error: "Invalid email or OTP." };
  }

  const resetToken = await prisma.passwordResetToken.findFirst({
    where: {
      userId: user.id,
      otp,
    },
  });

  if (!resetToken) {
    return { error: "Invalid email or OTP." };
  }

  if (new Date() > resetToken.expiresAt) {
    return { error: "Password reset code has expired." };
  }

  const { hashPassword } = await import("./auth");
  const hashedPassword = await hashPassword(password);

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    await prisma.passwordResetToken.delete({
      where: { id: resetToken.id },
    });

    return { success: true };
  } catch (error) {
    return { error: "Failed to reset password." };
  }
}
