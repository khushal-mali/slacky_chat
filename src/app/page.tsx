"use client";

import UserButton from "@/features/auth/components/user-button";
// import { useAuthActions } from "@convex-dev/auth/react";

export default function Home() {
  // const { signOut } = useAuthActions();

  return (
    <div className="">
      Logged In
      <UserButton />
    </div>
  );
}
