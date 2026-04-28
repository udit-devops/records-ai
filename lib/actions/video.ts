'use server'

import { apiFetch, doesTitleMatch, getEnv, withErrorHandling } from "../utils"
import { auth } from "../auth"
import { headers } from "next/headers"
import { BUNNY } from "@/constants"
import { user, videos } from "@/drizzle/schema"
import { db } from "@/drizzle/db"
import { revalidatePath } from "next/cache"
import { fixedWindow, request } from "@arcjet/next"
import aj from "../arcjet"
import { and, eq, ilike, or } from "drizzle-orm/sql/expressions/conditions"


import { sql } from "drizzle-orm/sql/sql"
import { any } from "better-auth"
import { desc, getOrderByOperators } from "drizzle-orm"




const VIDEO_STREAM_URL = BUNNY.STREAM_BASE_URL
const THUMBNAIL_STORAGE_URL = BUNNY.STORAGE_BASE_URL
const CDN_URL = BUNNY.CDN_URL
const BUNNY_LIBRARY_ID = getEnv("BUNNY_LIBRARY_ID")
 const ACCESS_KEY = {
    StreamAccesskey : getEnv("BUNNY_STREAM_ACCESS_KEY"),
    StorageAccessKey : getEnv("BUNNY_STORAGE_ACCESS_KEY")
 }


// helper function
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

const buildVideoWithUserQuery = () =>{
    return db 
    .select({
      videos : videos,
      user :{id:user.id, name:user.name , image: user.image}
    })
    .from(videos)
    .leftJoin(user,eq(videos.userId,user.id))
}

export const revalidatePaths = async(paths:string[]) =>{
   paths.forEach((path)=> revalidatePath(path))
}
const validateWithArcjet = async (fingerprint:string) =>{
   const rateLimit = aj.withRule(
      fixedWindow({
         window:'1m',
         mode:'LIVE',
         max:2,
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
            const fileName = `${Date.now()}-${videoId}-thumbnail`
            const uploadurl = `${THUMBNAIL_STORAGE_URL}/thumbnails/${fileName}`;
            const cdnurl = `${CDN_URL}/thumbnails/${fileName}`


            return{
               uploadurl,
               cdnurl,
               accessKey: ACCESS_KEY.StorageAccessKey

            }
})
const getOrderByClause = (sortFilter: string) => {
  switch (sortFilter) {
    case "newest":
      return sql`${videos.createdAt} desc`
    case "oldest":
      return sql`${videos.createdAt} asc`
    case "views":
      return sql`${videos.views} desc`
    default:
      return sql`${videos.createdAt} desc`
  }
}
export const saveVideoDetails = withErrorHandling(async (videoDetails:VideoDetails) => {
  const userId = await getSessionUserId();
  await validateWithArcjet(userId)

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
   
export const getAllVideos = withErrorHandling(
  async (
    searchQuery: string = '',
    sortFilter?: string,
    pageNumber: number = 1,
    pageSize: number = 10,
  ) => {
  const session = await auth.api.getSession({headers: await headers()})
  const currentUserId = session?.user.id
  const canSeeTheVideos = or(
   eq(videos.visibility, 'public'),
   eq(videos.userId,currentUserId!)
  )
  const whereCondition = searchQuery.trim()
  ? and(
   canSeeTheVideos,
   doesTitleMatch(videos,searchQuery),

  )
  : canSeeTheVideos

  const [{totalCount}] = await db 
  .select({totalCount: sql<number>`count(*)`})
  .from(videos)
  .where(whereCondition)
  const totalVideos =Number(totalCount||0);
  const totalPages = Math.ceil(totalVideos / pageSize);
  const videoRecords = await buildVideoWithUserQuery()
   .where(whereCondition)
    .orderBy(
      sortFilter
          ? getOrderByClause(sortFilter)
          : sql`${videos.createdAt} desc`
    ).limit(pageSize)
    .offset((pageNumber - 1) * pageSize)
  return{
   videos:videoRecords,
   pagination:{
      currentPage:pageNumber,
      totalPages,
      totalVideos,
      pageSize
   }

  };
  }
);
export const getVideoById = withErrorHandling(async(videoId: string)=>{
  const [videoRecord] = await buildVideoWithUserQuery()
  .where(eq(videos.id,videoId))
  return videoRecord
})
export const getAllVideosByUser = withErrorHandling(
  async (
    userIdParameter: string,
    searchQuery: string = "",
    sortFilter?: string
  ) => {
    const currentUserId = (
      await auth.api.getSession({ headers: await headers() })
    )?.user.id;
    const isOwner = userIdParameter === currentUserId;

    const [userInfo] = await db
      .select({
        id: user.id,
        name: user.name,
        image: user.image,
        email: user.email,
      })
      .from(user)
      .where(eq(user.id, userIdParameter));
    if (!userInfo) throw new Error("User not found");

        /* eslint-disable @typescript-eslint/no-explicit-any */
    const conditions = [
      eq(videos.userId, userIdParameter),
      !isOwner && eq(videos.visibility, "public"),
      searchQuery.trim() && ilike(videos.title, `%${searchQuery}%`),
    ].filter(Boolean) as any[];

    const userVideos = await buildVideoWithUserQuery()
      .where(and(...conditions))
      .orderBy(
        sortFilter ? getOrderByClause(sortFilter) : desc(videos.createdAt)
      );

    return { user: userInfo, videos: userVideos, count: userVideos.length };
  }
);
