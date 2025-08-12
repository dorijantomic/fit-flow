"use client";

import { AuthForm } from "@/components/auth/AuthForm";
import { loginSchema } from "@/lib/validations/loginSchema";
import { loginAction } from "@/lib/auth-actions";
import * as z from "zod";

export default function LoginPage() {
  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    const result = await loginAction(values.email, values.password);
    return result;
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      <AuthForm
        formSchema={loginSchema}
        formFields={[
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
        ]}
        onSubmit={handleLogin}
        submitButtonText="Log In"
        footerText="Don't have an account?"
        footerLinkText="Sign up"
        footerLinkHref="/auth/register"
      />
    </div>
  );
}
