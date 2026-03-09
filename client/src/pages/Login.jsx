import React from 'react'
import { assets } from '../assets/assets'
import { Star } from 'lucide-react'
import {SignIn} from '@clerk/clerk-react'
import TypeWriter from '../components/TypeWriter'

const Login = () => {
  return (
    <div className='min-h-screen flex flex-col md:flex-row bg-white dark:bg-gray-900 relative overflow-hidden'>
      {/* Background Image - Full Coverage */}
      <img src={assets.bgImage} alt="" className='absolute top-0 left-0 w-full h-full object-cover opacity-35'/>

      {/* Left side : Branding  */}
      <div className='flex-1 flex flex-col items-start justify-between p-6 md:p-10 lg:pl-40 relative z-10'>
        <img src={assets.logo} alt="Logo" className='h-12 object-contain'/>
        <div>
            <div className='flex items-center gap-3 mb-4 max-md:mt-10'> 
                <img src={assets.group_users} alt="Users" className='h-8 md:h-10'/>
                <div>
                    <div className='flex'>
                        {Array(5).fill(0).map((_, i)=>(<Star key={i} className='size-4 md:size-4.5 text-transparent fill-amber-500'/>))}
                    </div>
                    <p className='text-gray-700 dark:text-gray-300 text-sm'>Used by 10k+ developers</p>
                </div>
            </div>
            
            {/* Enhanced Hero Headline - Modern & Premium */}
            <div className='mt-6 md:mt-8'>
              <h1 className='font-black tracking-tight' style={{ lineHeight: '1.1' }}>
                <span className='block text-4xl md:text-6xl text-gray-900 dark:text-white'>Build. Code.</span>
                <span className='block text-5xl md:text-8xl'>
                  <TypeWriter 
                    text="Collaborate." 
                    speed={80} 
                    className='bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent dark:from-purple-400 dark:via-pink-400 dark:to-red-400 font-black'
                    style={{
                      filter: 'drop-shadow(0 0 20px rgba(168, 85, 247, 0.3))',
                      letterSpacing: '-0.02em'
                    }}
                  />
                </span>
              </h1>
            </div>

            {/* Modern Tagline - Clean & Professional */}
            <p className='mt-6 md:mt-8 text-lg md:text-xl font-medium text-gray-700 dark:text-gray-300 max-w-2xl leading-relaxed'>
              Where developers build the future together.
            </p>
        </div>
        <span className='md:h-10'></span>
      </div>

      {/* Right side: Login Form */}
      <div className='flex-1 flex items-center justify-center p-6 sm:p-10 relative z-10'>
            <SignIn />
      </div>
    </div>
  )
}

export default Login
