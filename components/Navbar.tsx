'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'


const user = {}
const Navbar = () => {
  const router = useRouter()
  return (
    <header className='navbar'>
      <nav>
        <Link href="/">
          <Image src="/assets/icons/logo.svg" alt ="Records ai logo" width={30} height={30}/>
          <h1>Ucast</h1>
        </Link>
{user &&(
 
        <figure  className='flex gap-9'>
          <button  onClick={() => router.push('/profile/123459')}>
            <Image src="/assets/images/dummy.jpg" alt="User" width={32} height={32} className='rounded-full aspect-square'/>
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