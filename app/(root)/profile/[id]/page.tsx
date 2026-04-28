import EmptyState from '@/components/EmptyState'
import Header from '@/components/Header'
import VideoCard from '@/components/VideoCard'
import { dummyCards } from '@/constants'
import { getAllVideosByUser } from '@/lib/actions/video'
import { redirect } from 'next/navigation'
import React from 'react'

const page = async({params,searchParams}:ParamsWithSearch) => {
    const {id} = await params;
    const{query,filter} = await searchParams;
    
     const res = await getAllVideosByUser(id, query, filter)
    if (!res.success) redirect('/404')
        const { user, videos } = res 
    if (!user) redirect('/404')
  return (
    <div className='wrapper page'>
        
        <Header 
        subHeader={user?.email}
        title={user?.name}
        userImg = {user?.image ?? ''}
        />
        
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
            <EmptyState icon='/assets/icons/video.svg' title='Yo No Video Available yet' description='Once You Uplo
            od the video will show up'/>
      )}
      
        
        
        </div>
  )
}

export default page