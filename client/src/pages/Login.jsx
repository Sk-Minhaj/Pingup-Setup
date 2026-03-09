import React from 'react'
import { assets } from '../assets/assets'
import { Star } from 'lucide-react'
import { SignIn } from '@clerk/clerk-react'
import TypeWriter from '../components/TypeWriter'

const Login = () => {
  return (
    <div className='min-h-screen flex flex-col md:flex-row bg-white dark:bg-gray-900 relative overflow-hidden'>
      {/* Background Image - Full Coverage */}
      <img src={assets.bgImage} alt="" className='absolute top-0 left-0 w-full h-full object-cover opacity-35' />

      {/* Left side : Branding  */}
      <div className='flex-1 flex flex-col items-start justify-between p-6 md:p-10 lg:pl-40 relative z-10'>
        <img src={assets.logo} alt="Logo" className='h-12 object-contain' />
        <div>
          <div className='flex items-center gap-3 mb-4 max-md:mt-10'>
            <img src={assets.group_users} alt="Users" className='h-8 md:h-10' />
            <div>
              <div className='flex'>
                {Array(5).fill(0).map((_, i) => (<Star key={i} className='size-4 md:size-4.5 text-transparent fill-amber-500' />))}
              </div>
              <p className='text-gray-700 dark:text-gray-300 text-sm'>Used by 10k+ developers</p>
            </div>
          </div>

          {/* Enhanced Hero Headline - Modern & Premium */}
          <div className='mt-6 md:mt-8'>
            <h1 style={{ lineHeight: '1.0' }}>
              <span
                className='block text-gray-900 dark:text-white'
                style={{ fontSize: 'clamp(2.25rem, 5vw, 3.75rem)', fontWeight: 750, letterSpacing: '-0.04em' }}
              >
                Build. Code.
              </span>
              <span className='block mt-1' style={{ fontSize: 'clamp(2.75rem, 6.5vw, 5rem)' }}>
                <TypeWriter
                  text="Collaborate."
                  speed={80}
                  className='hero-gradient-text'
                  style={{
                    fontWeight: 800,
                    letterSpacing: '-0.045em',
                  }}
                />
              </span>
            </h1>
          </div>

          {/* Modern Tagline - Clean & Professional */}
          <p className="mt-6 md:mt-7 text-gray-600 dark:text-gray-300 text-lg leading-relaxed font-medium tracking-tight">
            Where developers{" "}
            <span className="relative font-semibold text-gray-900 dark:text-white">
              build the future
              <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full"></span>
            </span>{" "}
            together.
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


/*


<p className='mt-6 md:mt-7 text-gray-600 dark:text-gray-300 text-lg leading-relaxed font-medium tracking-tight'>
  Where developers <span className='text-gray-900 dark:text-white font-semibold'>build the future</span> together.
</p>




*/


/* previuos version of hero headline and tagline


      <p
              className='mt-5 md:mt-6 text-gray-500 dark:text-gray-400'
              style={{ fontSize: '1.125rem', fontWeight: 500, lineHeight: '1.6', letterSpacing: '0.005em' }}
            >
              Where developers build the future together.
            </p>



*/

/* premium version of hero headline and tagline

<p className="mt-6 md:mt-7 text-gray-600 dark:text-gray-300 text-lg leading-relaxed font-medium tracking-tight">
  Where developers{" "}
  <span className="relative font-semibold text-gray-900 dark:text-white">
    build the future
    <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full"></span>
  </span>{" "}
  together.
</p>



*/