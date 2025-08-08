// import React from 'react'
import { FaGoogle } from 'react-icons/fa'
import { Link, useLocation } from 'react-router-dom'


const Navbar = () => {
  const location = useLocation()
  return (
    <nav className="fixed w-full flex justify-center items-center  py-3  backdrop-blur-sm z-20 ">
        <div className="flex flex-row sm:w-3/4 w-full justify-between rounded-full p-2 bg-white px-5 shadow-lg">
        <div className="text-xl font-bold tracking-tight text-black py-1">
          <Link to={'/'}>IntervAI</Link>
        </div>
        <Link to={'/login'}>
        {location.pathname == '/login' ?
        <button  className="flex items-center gap-2 px-4 py-2  text-gray-900 rounded-full hover:bg-indigo-300 transition-all border border-indigo-600 "></button> :
         <button className="flex items-center gap-2 px-4 py-2  text-gray-900 rounded-full hover:bg-indigo-300 transition-all border border-indigo-600 ">
          <FaGoogle />
          SignUp
        </button>}
        </Link>
        </div>
      </nav>
  )
}

export default Navbar
