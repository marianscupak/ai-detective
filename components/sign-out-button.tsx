"use client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export const SignOutButton = () => {
  const router = useRouter();

  return (
    <button
      className="text-black bg-gray-300 rounded-xl p-2"
      type="button"
      onClick={async () =>
        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push("/login");
              router.refresh();
            },
          },
        })
      }
    >
      Sign out
    </button>
  );
};
