'use client'

import { authClient } from '@/lib/auth-client'
import Image from 'next/image'
import Link from 'next/link'
import { redirect, useRouter } from 'next/navigation'
import React from 'react'
import { useAtom } from "jotai";

const Navbar = () => {
  const router = useRouter();
  const  {data:session} = authClient.useSession();
  const user = session?.user;
  return (
    <header className='navbar'>
      <nav>
        <Link href="/">
          <Image src="/assets/icons/logo.svg" alt ="Records ai logo" width={30} height={30}/>
          <h1>Ucast</h1>
        </Link>
{user &&(
 
        <figure  className='flex gap-9'>
          <button  onClick={() => router.push(`/profile/${user?.id}`)}>
            <Image src={user?.image || ''}alt="User" width={32} height={32} className='rounded-full aspect-square'/>
          </button> 
   
          <button className='cursor-pointer'>
                   <Image src="/assets/icons/logout.png" alt="Logout" width={26} height={26} />
          </button>
        </figure>
        
)}
      </nav>
    </header>
  )
}

export default Navbar