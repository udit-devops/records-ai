import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <main className="sign-in">
      <aside className='testimonial'>
        <Link href="/">
        <Image src="/assets/icons/logo.svg" alt="logo" width={30} height={30}/>
        </Link>
        <div className='description'>
          <section>
            <figure>
                  {Array.from({ length: 5 } ).map((_, index) => (
                     <Image src="/assets/icons/star.svg" alt='stars' width={18} height={18} key={index}/>
                  ))}
            </figure>
            <p>Fast, seamless screen recording for creators and teams. Record, store and share videos instantly — super clean, super simple, always high quality.</p>
         <article>
          <Image src="/assets/images/david.png" alt='david' height={70} width={70} className='rounded-full'/>
         <div>
          <h4>David Shukla</h4>
          <p>Backend enginner , Detoxi</p>
         </div>
         </article>
          </section>
        
           
          
        </div>
         <p>@Ucast {(new Date()).getFullYear()}</p>
      </aside>
      <aside className='google-sign-in'>
        <section>
          <Link href="/">
           <Image src="/assets/icons/logo.svg" alt="logo" width={50} height={50}/>
           <h1>Ucast</h1>
          </Link>
        </section>
      </aside>
    </main>
  )
}

export default page