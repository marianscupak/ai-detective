import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { SignOutButton } from "./sign-out-button";

const ProfileLink = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return (
      <Link href="/sign-in" className="text-black text-xl font-medium">
        Sign in
      </Link>
    );
  }

  return (
    <div className="flex gap-3 items-center">
      <Link href="/profile" className="text-black text-xl font-medium">
        {session.user.name}
      </Link>
      <SignOutButton />
    </div>
  );
};

export default ProfileLink;
