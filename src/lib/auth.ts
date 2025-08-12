import prisma from "./prisma";
import { createSession as createJWTSession } from "./session";
import argon2 from "argon2";
import { User } from "@prisma/client";

export async function hashPassword(password: string) {
  return await argon2.hash(password);
}

export async function verifyPassword(password: string, hash: string) {
  return await argon2.verify(hash, password);
}

export async function createSession(userId: string) {
  await createJWTSession(userId);
}

export async function login(
  email: string,
  password: string
): Promise<{ error?: string; user?: User }> {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return { error: "Invalid email or password" };
  }

  if (!user.emailVerified) {
    return { error: "Email not verified." };
  }

  const isValidPassword = await verifyPassword(password, user.password);

  if (!isValidPassword) {
    return { error: "Invalid email or password" };
  }

  await createSession(user.id);

  return { user };
}
