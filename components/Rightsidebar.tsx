"use client"

import { SignedIn, UserButton } from '@clerk/nextjs'
import { useUser } from '@clerk/clerk-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Carousel from './Carousel'
import Header from './Header'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useRouter } from 'next/navigation'
import LoaderSpinner from './LoaderSpinner'

const Rightsidebar = () => {
  const {user} = useUser()
  const topPodCasters = useQuery(api.users.getTopUserByPodcastCount)

  const router = useRouter()

  if(!topPodCasters) return <LoaderSpinner />

  return (
    <section className='right_sidebar text-white'>
        <SignedIn>
          <Link href={`/profile/${user?.id}`}>
            <UserButton />
            <div className='flex w-full items-center justify-between'>
              <h1 className='text-16 truncate font-semibold text-white-1'>{user?.firstName} {user?.lastName}</h1>
              <Image 
                src="/icons/right-arrow.svg"
                alt='arrow'
                width={24}
                height={24}
              />
            </div>
          </Link>
        </SignedIn>
        <section>
          <Header headerTitle="Fans like you" />
          <Carousel fansLikeDetail={topPodCasters!} />
        </section>
        <section className='flex flex-col gap-8 pt-12'>
        <Header headerTitle="Top Podcasters" />
        <div className='flex flex-col gap-6'>
          {topPodCasters?.slice(0, 4).map((podcaster) => (
            <div key={podcaster._id} className='flex cursor-pointer justify-between' onClick={() => router.push(`/profile/${podcaster.clerkId}`)}>
              <figure className='flex items-center gap-2'>
                <Image
                  src={podcaster.imageUrl}
                  alt={podcaster.name}
                  width={40}
                  height={40}
                  className='aspect-square rounded-lg'
                />
                <h2 className='text-14 font-semibold text-white-1'>{podcaster.name}</h2>
              </figure>
              <div className='flex items-center'>
                <p className='text-12 font-normal'>{podcaster.totalPodcasts} podcasts</p>
              </div>
            </div>
          ))}
        </div>
        </section>
    </section>
  )
}

export default Rightsidebar