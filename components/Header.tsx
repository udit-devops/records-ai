import { ICONS } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import DropDownList from './DropDownList'

const Header = ({subHeader , title , userImg}:SharedHeaderProps) => {
  return (
    
    <header className='header'>
        <section className='header-container'>
            <div className='details'>
                {userImg && (
                    <Image src={userImg} alt="user image" width={55} height={55} className='rounded-full' />
            )}

            <article>
              <p>{subHeader}</p>
              <h2>{title}</h2>
            </article>
            </div>

            <aside>
              <Link href='/upload'>
               <Image src="/assets/icons/upload.svg" alt='upload' width={15} height={15}/>
               <span>Upload</span>

              </Link>
               <div className='record'>
              <button className='primary-btn'>
                <Image src={ICONS.record} alt='record' width={15} height={15}/>
               <span>Record the video</span> 
                </button>
            </div>
            </aside>
           
        </section>
        <section className='search-filter'>

          <div className='search'>
            <input type="text" placeholder='  Search for videos , tags , folders...'/>
            <Image src='/assets/icons/search.svg'alt='search' width={24} height={24}/>
          </div>
             <DropDownList /> 
        </section>
    </header>
  )
}

export default Header