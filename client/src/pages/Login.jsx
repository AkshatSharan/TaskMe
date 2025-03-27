import React from 'react'
import { NavLink } from 'react-router-dom'

const Login = () => {
    return (
        <div className='bg-blue-200 center-page items-middle flex-col px-7 py-10 rounded-lg max-sm:w-[80vw] w-[400px]'>
            <h1 className='text-2xl font-bold min-md:text-3xl'>Welcome Back</h1>
            <p className='text-xs mt-3'>Sign in to your account</p>
            <form className='flex flex-col w-full mt-6 gap-5 text-sm'>
                <label className='flex flex-col gap-2'>
                    Email
                    <input type='text' placeholder='Enter email' className='input-box text-md' />
                </label>
                <label className='flex flex-col gap-2'>
                    Password
                    <input type='password' placeholder='Enter password' className='input-box text-md' />
                </label>

                <p className='text-gray-400 text-xs cursor-pointer'>Forgot password?</p>

                <input type='submit' value="Sign In" className='site-button'
                    onClick={(e) => { e.preventDefault() }}
                />

                <div className='flex gap-1'>
                    <p>Don't have an account?</p>
                    <NavLink to='/signup'><p className='text-gray-400 underline cursor-pointer'>Sign up</p></NavLink>
                </div>
            </form>
        </div>
    )
}

export default Login