import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    token: z.string(),
    otp: z.string().length(6, "OTP must be 6 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
