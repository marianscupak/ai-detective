"use client";
import { authClient } from "@/lib/auth-client";

export const SigninButton = () => {
  return (
    <button
      className="bg-blue-300 rounded-xl p-2"
      type="button"
      onClick={() => authClient.signIn.social({ provider: "github" })}
    >
      Sign in with Github
    </button>
  );
};
