'use server'

import { apiFetch, getEnv, withErrorHandling } from "../utils"
import { auth } from "../auth"
import { headers } from "next/headers"
import { BUNNY } from "@/constants"
import { videos } from "@/drizzle/schema"
import { db } from "@/drizzle/db"
import { revalidatePath } from "next/cache"
import { fixedWindow, request } from "@arcjet/next"
import aj from "../arcjet"




const VIDEO_STREAM_URL = BUNNY.STREAM_BASE_URL
const THUMBNAIL_STORAGE_URL = BUNNY.STORAGE_BASE_URL
const CDN_URL = BUNNY.CDN_URL
const BUNNY_LIBRARY_ID = getEnv("BUNNY_LIBRARY_ID")
 const ACCESS_KEY = {
    StreamAccesskey : getEnv("BUNNY_STREAM_ACCESS_KEY"),
    StorageAccessKey : getEnv("BUNNY_STORAGE_ACCESS_KEY")
 }



const getSessionUserId = async (): Promise<string> =>{
const session = await auth.api.getSession({headers: await headers()})
if (!session ) throw new Error("no autheticated user")
    return session.user.id;
}

export const getVideoUploadUrl = withErrorHandling(async () =>{
        await getSessionUserId();

        const videoResponse = await apiFetch<BunnyVideoResponse>(
         `${VIDEO_STREAM_URL}/${BUNNY_LIBRARY_ID}/videos`,
         {
            method: 'POST',
            bunnyType: 'stream',
            body:{title:"temporary title",}

         }
       

      )
        console.log("🔥 videoResponse:", videoResponse)
  console.log("🔥 accessKey:", ACCESS_KEY.StreamAccesskey)
          const uploadUrl = `${VIDEO_STREAM_URL}/${BUNNY_LIBRARY_ID}/videos/${videoResponse.guid}`;
         return{
            videoId: videoResponse.guid,
            uploadUrl,
            accessKey: ACCESS_KEY.StreamAccesskey
         }
        
}) 

export const revalidatePaths = async(paths:string[]) =>{
   paths.forEach((path)=> revalidatePath(path))
}
const validateWithArcjet = async (fingerprint:string) =>{
   const rateLimit = aj.withRule(
      fixedWindow({
         window:'1m',
         mode:'LIVE',
         max:1,
         characteristics : ['fingerprint'],

         
      })
   )
   const req = await request();
   const decision = await rateLimit.protect(req,{fingerprint})

   if(decision.isDenied()){
      throw new Error("rate limit excedded")
   }
}
export const getThumbnailUploadUrl = withErrorHandling(async (videoId: string)=>{
            const fileName = `${Date.now()}-${videoId}-thumbnail}`
            const uploadurl = `${THUMBNAIL_STORAGE_URL}/thumbnails/${fileName}`;
            const cdnurl = `${CDN_URL}/thumbnails/${fileName}`


            return{
               uploadurl,
               cdnurl,
               accessKey: ACCESS_KEY.StorageAccessKey

            }
})

export const saveVideoDetails = withErrorHandling(async (videoDetails:VideoDetails) => {
  const userId = await getSessionUserId();

   await apiFetch(
      `${VIDEO_STREAM_URL}/${BUNNY_LIBRARY_ID}/videos/${videoDetails.videoId}`,

      {
         method:'POST',
         bunnyType:'stream',
         body:{
            title: videoDetails.title,
            description: videoDetails.description,
         }
      }
   )
   await db.insert(videos).values({
      
          ...videoDetails,
          
          videoUrl: `${BUNNY.EMBED_URL}/${BUNNY_LIBRARY_ID}/${videoDetails.videoId}`,
          userId,
          createdAt:new Date(),
          updatedAt:new Date(),
   });

   revalidatePaths(['/'])

   return {videoId:videoDetails.videoId}
} )
   
