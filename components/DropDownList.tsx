'use client'
import Image from 'next/image'
import React, { useState } from 'react'

const DropDownList = () => {
    const[isOpen , setIsOpen] = useState(false)
  return (
    <div className='relative'>
       <div className='cursor-pointer' onClick={()=> setIsOpen(!isOpen)}>
           <div className='filter-trigger'>
            <figure >
               <Image src="/assets/icons/hamburger.svg" alt='drop-menu' width={15}height={15}/>
               Most recent
               <Image src ="/assets/icons/arrow-down.svg" alt='aroow' width={14} height={14}/>
            </figure>
           </div>
       </div>
       {isOpen && (
        <ul className='dropdown'>
          {['Most recent', 'Most liked'].map((option)=>(
                <li key={option} className="list-item">{option}</li>
          ))}
    
        </ul>
       )}
    </div>
  )
}

export default DropDownList