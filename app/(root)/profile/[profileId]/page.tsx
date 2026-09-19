"use client";

import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import PodcastCard from "@/components/PodcastCard";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Image from "next/image";

type ProfilePageProps = {
  params: { profileId: string };
};

const ProfilePage = ({ params: { profileId } }: ProfilePageProps) => {
  const user = useQuery(api.users.getUserById, { clerkId: profileId });
  const podcastData = useQuery(api.podcast.getPodcastByAuthorId, {
    authorId: profileId,
  });

  if (user === undefined || podcastData === undefined) return <LoaderSpinner />;

  if (!user) {
    return (
      <section className="mt-10">
        <EmptyState
          title="This podcaster could not be found"
          buttonLink="/discover"
          buttonText="Discover podcasts"
        />
      </section>
    );
  }

  const podcastLabel = podcastData.podcasts.length === 1 ? "podcast" : "podcasts";
  const listenerLabel = podcastData.listeners === 1 ? "listener" : "listeners";

  return (
    <section className="mt-10 flex w-full flex-col gap-10 pb-10">
      <header className="flex flex-col gap-6 border-b border-black-5 pb-10 sm:flex-row sm:items-center">
        <Image
          src={user.imageUrl}
          width={128}
          height={128}
          alt={`${user.name}'s profile picture`}
          className="size-32 rounded-full object-cover"
        />
        <div className="flex flex-col gap-2">
          <p className="text-14 font-semibold uppercase tracking-wide text-orange-1">
            Podcaster profile
          </p>
          <h1 className="text-32 font-extrabold text-white-1">{user.name}</h1>
          <p className="text-16 text-white-2">{user.email}</p>
          <div className="mt-3 flex gap-8 text-white-1">
            <div>
              <p className="text-20 font-bold">{podcastData.podcasts.length}</p>
              <p className="text-14 text-white-3">{podcastLabel}</p>
            </div>
            <div>
              <p className="text-20 font-bold">{podcastData.listeners}</p>
              <p className="text-14 text-white-3">{listenerLabel}</p>
            </div>
          </div>
        </div>
      </header>

      <section className="flex flex-col gap-5">
        <h2 className="text-20 font-bold text-white-1">Published podcasts</h2>
        {podcastData.podcasts.length ? (
          <div className="podcast_grid">
            {podcastData.podcasts.map(
              ({ _id, podcastTitle, podcastDescription, imageUrl }) => (
                <PodcastCard
                  key={_id}
                  podcastId={_id}
                  title={podcastTitle}
                  description={podcastDescription}
                  imgUrl={imageUrl ?? "/images/player1.png"}
                />
              )
            )}
          </div>
        ) : (
          <EmptyState title="This podcaster has not published anything yet" />
        )}
      </section>
    </section>
  );
};

export default ProfilePage;
