"use client";

import { AuthForm } from "@/components/auth/AuthForm";
import { registerSchema } from "@/lib/validations/registerSchema";
import { registerAction } from "@/lib/auth-actions";
import * as z from "zod";
import { useState } from "react";

export default function RegisterPage() {
  const [success, setSuccess] = useState(false);

  const handleRegister = async (values: z.infer<typeof registerSchema>) => {
    const result = await registerAction(values.email, values.password, values.name);
    if (!result.error) {
      setSuccess(true);
    }
    return result;
  };

  if (success) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Registration Successful</h1>
        <p>Please check your email to verify your account.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Create an Account</h1>
      <AuthForm
        formSchema={registerSchema}
        formFields={[
          {
            name: "name",
            label: "Name",
            type: "text",
            placeholder: "Enter your name",
          },
          {
            name: "email",
            label: "Email",
            type: "email",
            placeholder: "Enter your email",
          },
          {
            name: "password",
            label: "Password",
            type: "password",
            placeholder: "Enter your password",
          },
          {
            name: "confirmPassword",
            label: "Confirm Password",
            type: "password",
            placeholder: "Confirm your password",
          },
        ]}
        onSubmit={handleRegister}
        submitButtonText="Sign Up"
        footerText="Already have an account?"
        footerLinkText="Log in"
        footerLinkHref="/auth/login"
      />
    </div>
  );
}
