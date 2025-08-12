"use server";

import { hmac } from "@oslojs/crypto/hmac";
import { SHA256 } from "@oslojs/crypto/sha2";
import { encodeJWT, parseJWT, JWTRegisteredClaims } from "@oslojs/jwt";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

export async function createSession(userId: string) {
  const header = {
    alg: "HS256",
    typ: "JWT",
  };
  const payload = {
    sub: userId,
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  };

  const headerJSON = JSON.stringify(header);
  const payloadJSON = JSON.stringify(payload);

  const signatureMessage = new TextEncoder().encode(
    Buffer.from(headerJSON).toString("base64url") +
      "." +
      Buffer.from(payloadJSON).toString("base64url")
  );
  const signature = await hmac(SHA256, secret, signatureMessage);

  const jwt = encodeJWT(headerJSON, payloadJSON, signature);
  const cookieStore = await cookies();
  cookieStore.set("session", jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("session")?.value;
  if (!jwt) return null;
  try {
    const [, payload, signature, signatureMessage] = parseJWT(jwt);
    const valid = hmac(SHA256, secret, signatureMessage);
    if (valid.toString() !== signature.toString()) {
      return null;
    }
    const claims = new JWTRegisteredClaims(payload);
    if (!claims.verifyExpiration()) {
      return null;
    }
    return payload as { sub: string; exp: number };
  } catch {
    return null;
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.set("session", "", { expires: new Date(0) });
}
