import React from 'react'
import Name from './Name'

const LoginBanner = () => {
  return (
    <div className='w-full py-4  flex flex-col justify-center items-center'>
        <img src='/merilogo.png' className='w-20 my-4'/>
        <h1 className=' flex flex-row items-center gap-1 text-md'>Welcome to <Name breaks={false}/></h1>
    </div>
  )
}

export default LoginBanner