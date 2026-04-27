import VideoDetailHeader from "@/components/VideoDetailHeader"
import VideoPlayer from "@/components/VideoPlayer"
import { getVideoById } from "@/lib/actions/video"
import { url } from "inspector/promises"
// import { url } from "inspector/promises"

import { redirect } from "next/navigation"

const page = async({params}:Params) => {
   const {videoId} = await params
  const res = await getVideoById(videoId)
  if (!res.success) {
  throw new Error(res.error)
}

const { user, videos } = res
   if(!videos) redirect('/404')
  return (
    <main className='wrapper page'>
      <VideoDetailHeader {...videos} userImg={user?.image} username={user?.name} ownerId={videos.userId}/>
      {/* <h1 className="text-2xl">{videos.title}</h1>
      <h1 className="text-2xl">{videos.id}</h1> */}
      <section className="video-details">
        <div className="content">
         <VideoPlayer videoId={videos.videoId}/>
        </div>
      </section>
   
      </main>
  )
}

export default page
