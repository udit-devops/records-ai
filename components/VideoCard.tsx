import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const VideoCard = ({id,
  thumbnail,
  title,
  duration,
  userImg,
  username,
  visibility,
  views,
  createdAt
}:VideoCardProps) => {
  return (
<Link href={`/video/${id}`} className="video-card">
<Image src={thumbnail} alt={title} width={190} height={90} className="thumbnail"/>

<article>
  <div>
    <figure>
      <Image src={userImg} alt={username} width={30} height={30} className="rounded-full aspect-square"/>
      <figcaption>
        <h3>{username}</h3>
        <p>{visibility}</p>
      </figcaption>
    </figure>
    <aside>
      <Image src="/assets/icons/eye.svg" alt="views" width={16} height={16}/>
      <span>{views}</span>
    </aside>
  </div>
  <h2>{title} - {" "} {createdAt.toLocaleDateString
( 'en-US', { 
year: 'numeric', 
month: 'short', 
day: 'numeric'

})}

  </h2>
</article>
</Link>
  )
}

export default VideoCard