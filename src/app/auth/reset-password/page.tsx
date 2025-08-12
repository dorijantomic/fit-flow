"use client";

import { AuthForm } from "@/components/auth/AuthForm";
import { resetPasswordSchema } from "@/lib/validations/resetPasswordSchema";
import { resetPasswordAction } from "@/lib/auth-actions";
import * as z from "zod";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (
    values: z.infer<typeof resetPasswordSchema>
  ) => {
    if (!email) return { error: "Email not found in URL" };
    const result = await resetPasswordAction(email, values.otp, values.password);
    if (!result?.error) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    }
    return result;
  };

  if (success) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Password Reset Successful</h1>
        <p>You will be redirected to the login page shortly.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Reset Your Password</h1>
      <AuthForm
        formSchema={resetPasswordSchema}
        formFields={[
          {
            name: "otp",
            label: "One-Time Password (OTP)",
            type: "text",
            placeholder: "Enter your OTP",
          },
          {
            name: "password",
            label: "New Password",
            type: "password",
            placeholder: "Enter your new password",
          },
          {
            name: "confirmPassword",
            label: "Confirm New Password",
            type: "password",
            placeholder: "Confirm your new password",
          },
        ]}
        onSubmit={handleResetPassword}
        submitButtonText="Reset Password"
        footerText=""
        footerLinkText=""
        footerLinkHref=""
      />
    </div>
  );
}
