import React from 'react'
import LandingHero from '../assets/LandingHero.svg'
import GroupIcon from '../assets/GroupIcon.svg'
import NotificationIcon from '../assets/Notification.svg'
import ChartIcon from '../assets/ChartIcon.svg'
import { NavLink } from 'react-router-dom'

const Landing = () => {
    return (
        <div>
            <div className='flex flex-col sm:min-h-screen'>
                <nav className='flex items-center justify-between border-b border-b-accent-stroke px-5 py-3'>
                    <h1 className='font-bold min-md:text-3xl text-xl text-center'>TaskMe</h1>
                    <div className='flex align-middle h-fit justify-end min-sm:gap-10 sm:text-md text-xs'>
                        <NavLink to='/signup'><button className='mx-auto p-3 rounded-xl cursor-pointer px-4 w-fit m-0'>Sign Up</button></NavLink>
                        <NavLink to='/login'><button className='site-button px-12 max-sm:px-4 w-fit m-0'>Login</button></NavLink>
                    </div>
                </nav>

                <section className='
                    site-pad flex flex-col sm:flex-row gap-10 w-full
                    flex-1 items-center sm:justify-center
                '>
                    <div className='flex flex-col gap-5 w-full md:w-1/2 items-start text-left sm:justify-center'>
                        <div className='font-bold text-2xl lg:text-4xl'>
                            <h1>Collaborate Smarter,</h1>
                            <h1>Achieve Together</h1>
                        </div>
                        <p className='text-xs text-text-gray lg:text-xl'>
                            The ultimate task management platform for planning
                            and performance. Transform your workflow, boost
                            productivity, and accomplish more as a team.
                        </p>
                        <NavLink to='/signup' className='max-sm:mx-auto site-button text-xs sm:w-fit sm:m-0 lg:text-lg px-4 text-center'>Get Started</NavLink>
                    </div>

                    <div className="w-full md:w-1/2 flex justify-center md:justify-start">
                        <img src={LandingHero} className='w-full h-auto object-contain' alt="Landing Hero" />
                    </div>
                </section>

            </div>
            <section className='
                sm:px-11 p-5 py-10 flex flex-col gap-7 w-full
                sm:items-start items-center justify-center
            '>
                <h1 className='font-bold sm:text-3xl text-xl max-sm:text-center w-full'>Everything you need to manage tasks effectively!</h1>

                <div className='w-full flex gap-5 max-sm:flex-col md:gap-10 md:mt-6'>
                    <div className='bg-blue-200 p-5 rounded-lg flex flex-col gap-2 border border-accent-stroke'>
                        <img src={GroupIcon} className='h-8 w-fit' />
                        <h2 className='font-bold'>Group Task Management</h2>
                        <p className='text-text-gray text-xs'>Collaborate seamlessly with your team. Create,
                            assign, track, and manage tasks efficiently.</p>
                    </div>
                    <div className='bg-blue-200 p-5 rounded-lg flex flex-col gap-2 border border-accent-stroke'>
                        <img src={ChartIcon} className='h-8 w-fit' />
                        <h2 className='font-bold'>Progress Tracking</h2>
                        <p className='text-text-gray text-xs'>Monitor project progress with intuitive
                            dashboards and real-time performance
                            analytics.</p>
                    </div>
                    <div className='bg-blue-200 p-5 rounded-lg flex flex-col gap-2 border border-accent-stroke'>
                        <img src={NotificationIcon} className='h-8 w-fit' />
                        <h2 className='font-bold'>Group Task Management</h2>
                        <p className='text-text-gray text-xs'>Stay updated on important milestones and
                            never miss any updates with AI-powered alerts.</p>
                    </div>
                </div>
            </section>

            <section className='
                sm:px-11 p-5 sm:py-10 py-6 flex flex-col gap-7 w-full
                sm:items-start items-center justify-center sm:mt-10 mt-4
                bg-blue-200
            '>
                <h1 className='font-bold sm:text-3xl text-xl max-sm:text-center w-full sm:mb-5'>How It Works</h1>

                <div className='flex flex-col items-start w-full sm:mb-5'>
                    <div className='flex items-center gap-4'>
                        <p className='bg-black text-white flex items-center justify-center rounded-full w-9 h-9'>
                            1
                        </p>
                        <h2 className="text-left font-bold text-lg">Create & Assign Tasks</h2>
                    </div>
                    <p className="ml-[calc(2.25rem+1rem)] max-sm:text-xs text-text-gray">Easily create tasks, set priorities, and assign
                        them to team members with deadlines.</p>
                </div>
                <div className='flex flex-col items-start w-full sm:mb-5'>
                    <div className='flex items-center gap-4'>
                        <p className='bg-black text-white flex items-center justify-center rounded-full w-9 h-9'>
                            2
                        </p>
                        <h2 className="text-left font-bold text-lg">Track Progress</h2>
                    </div>
                    <p className="ml-[calc(2.25rem+1rem)] max-sm:text-xs text-text-gray">Monitor task completion, track performance,
                        and identify bottlenecks in real-time..</p>
                </div>
                <div className='flex flex-col items-start w-full sm:mb-5'>
                    <div className='flex items-center gap-4'>
                        <p className='bg-black text-white flex items-center justify-center rounded-full w-9 h-9'>
                            3
                        </p>
                        <h2 className="text-left font-bold text-lg">Complete & Celebrate</h2>
                    </div>
                    <p className="ml-[calc(2.25rem+1rem)] max-sm:text-xs text-text-gray">Mark tasks as complete and celebrate team
                        achievements together.</p>
                </div>

            </section>

            <section className='
                sm:px-11 p-5 py-20  flex flex-col gap-7 w-full
                items-center justify-center
                text-center bg-black
            '>
                <div className='flex flex-col gap-1'>
                    <h1 className='font-bold sm:text-3xl text-xl w-full'>Start Boosting Your Team's</h1>
                    <h1 className='font-bold sm:text-3xl text-xl w-full'>Productivity Today!</h1>
                </div>
                <p className='text-center text-text-gray w-full'>Join thousands of teams already using TaskMate to achieve their goals</p>
                <NavLink to='/signup' className='site-button-inverted w-fit sm:px-10 px-4 max-sm:text-sm'>Get Started</NavLink>
            </section>
        </div>
    )
}

export default Landing
