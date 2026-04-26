import EmptyState from '@/components/EmptyState'
import Header from '@/components/Header'
import VideoCard from '@/components/VideoCard'
import { dummyCards } from '@/constants'
import { getAllVideos } from '@/lib/actions/video'
import React from 'react'

const Page = async({searchParams}:SearchParams) => {
  const {query,filter,page} = await searchParams
const res = await getAllVideos(query, filter, Number(page) || 1)

if (!res.success) {
  throw new Error(res.error)
}

const { videos, pagination } = res
  return (
    <main className=' wrapper page'>
      <Header title='All Videos' subHeader='Public Library'/>
   
      {videos?.length>0 ? (
        <section className="video-grid">
           {videos.map(({videos,user}) =>(
            <VideoCard 
            key={videos.id} 
            {...videos} 
            thumbnail={videos.thumbnailUrl}
            userImg={user?.image || ' '}
            username={user?.name|| 'Guest'}
            />
           ))}
          </section>
      ):(
            <EmptyState icon='/assets/icons/video.svg' title='No Video Found' description='Try adjustiong your search'/>
      )}
      
      </main>
  )
}

export default Page