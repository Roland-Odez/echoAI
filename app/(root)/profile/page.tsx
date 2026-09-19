"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Profile = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) router.replace(`/profile/${user.id}`);
  }, [router, user]);

  return (
    <section className="mt-10 flex min-h-[40vh] items-center justify-center">
      <p className="text-16 text-white-2">
        {isLoaded ? "Opening your profile..." : "Loading profile..."}
      </p>
    </section>
  );
};

export default Profile;
