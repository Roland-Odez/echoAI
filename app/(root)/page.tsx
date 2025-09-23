"use client";
import React from 'react'
import PodcastCard from '@/components/PodcastCard'
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const Home = () => {
  const podcasts = useQuery(api.podcast.getTrendingPodcasts)
  
  return (
    <div className='mt-9 flex flex-col gap-9'>
      <section className='flex flex-col gap-5'>
        <h1 className='text-20 font-bold text-white-1'>Trending Podcasts</h1>
        <div className='podcast_grid'>
          {podcasts ? podcasts?.map(({_id, podcastTitle, podcastDescription, imageUrl}) => (
            <PodcastCard
              key={_id}
              title={podcastTitle}
              imgUrl={imageUrl ? imageUrl : ""}
              description={podcastDescription}
              podcastId={_id}
            />
          )) : <h1 className='text-white-1'>No trending videos</h1>}
        </div>
      </section>

    </div>
  )
}

export default Home