"use client";

import { AuthForm } from "@/components/auth/AuthForm";
import { forgotPasswordSchema } from "@/lib/validations/forgotPasswordSchema";
import { forgotPasswordAction } from "@/lib/auth-actions";
import * as z from "zod";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [success, setSuccess] = useState(false);

  const handleForgotPassword = async (
    values: z.infer<typeof forgotPasswordSchema>
  ) => {
    const result = await forgotPasswordAction(values.email);
    if (!result?.error) {
      setSuccess(true);
    }
    return result;
  };

  if (success) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Email Sent</h1>
        <p>If an account with that email exists, a password reset code has been sent.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Forgot Password</h1>
      <AuthForm
        formSchema={forgotPasswordSchema}
        formFields={[
          {
            name: "email",
            label: "Email",
            type: "email",
            placeholder: "Enter your email",
          },
        ]}
        onSubmit={handleForgotPassword}
        submitButtonText="Send Reset Code"
        footerText="Remember your password?"
        footerLinkText="Log in"
        footerLinkHref="/auth/login"
      />
    </div>
  );
}
