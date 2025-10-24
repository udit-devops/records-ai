import Header from '@/components/Header'
import React from 'react'

const page = async({params}:ParamsWithSearch) => {
    const {id} = await params
  return (
    <div className='wrapper page'>
        
        <Header 
        subHeader="reosnow@gmail.com"
        title="Reo Snow | Backend Developer"
        userImg = "/assets/images/dummy.jpg"
        />
        
       <h1 className='font-karla font-bold text-cyan-800'> User Id - : {id}</h1> 
        
        
        </div>
  )
}

export default page