import React from 'react'

const MediaSelection = () => {
  return (
    <section>
        {/* Header : Logo */}
        
        {/* Intro Text */}
        <div className='flex items-center justify-center text-3xl font-bold'>
            Choose video or article 
        </div>

        {/* Body : Media Selection */}
        <div className='grid grid-cols-2 gap-8 p-4 m-4 items-center justify-center min-h-screen'>
            {/* Left Side : Article Options */}
            <div className='border-2 rounded-md p-4 h-full w-full shadow-sm hover:cursor-pointer hover:shadow-2xl transition-all duration-300 ease-in-out hover:-translate-x-2 hover:-translate-y-2 hover:scale-105'>
                Article 
            </div>
            {/* Right Side : Video Options */}
            <div className='border-2 rounded-md p-4 h-full w-full shadow-sm hover:cursor-pointer hover:shadow-2xl transition-all duration-300 ease-in-out hover:translate-x-2 hover:-translate-y-2 hover:scale-105'>
                Video
            </div>
        </div>
    </section>
  )
}

export default MediaSelection