import Header from '@/components/Header'
import VideoCard from '@/components/VideoCard'
import React from 'react'

const Page = () => {
  return (
    <main className=' wrapper page'>
      <Header title='All Videos' subHeader='Public Library'/>
      <h1 className='text-2xl font-bold text-black-400 '>Welcome to Records ai</h1>
      <VideoCard 
      id='2'
      thumbnail='/assets/samples/thumbnail (1).png'
      title='Mattermost tutorial'
      duration={140}
      userImg='/assets/images/jason.png'
      username='Jason Rashford'
      visibility='public'
      createdAt={new Date('2025-10-01')}
      views={120}
      />
      </main>
  )
}

export default Page