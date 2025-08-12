"use client";

import { verifyEmailAction } from "@/lib/auth-actions";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [result, setResult] = useState<{
    success?: boolean;
    error?: string;
  } | null>(null);

  useEffect(() => {
    if (token) {
      verifyEmailAction(token).then(setResult);
    }
  }, [token]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Verifying your email...</h1>
        {result === null && <p>Please wait.</p>}
        {result?.success && (
          <div>
            <p className="text-green-500">Email verified successfully!</p>
            <Link href="/auth/login" className="text-blue-500 hover:underline">
              Click here to login
            </Link>
          </div>
        )}
        {result?.error && (
          <div>
            <p className="text-red-500">{result.error}</p>
            <p>Please try registering again.</p>
          </div>
        )}
        {!token && <p className="text-red-500">No verification token found.</p>}
      </div>
    </div>
  );
}
