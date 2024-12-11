'use client'

import React, { useContext } from 'react';
import axios from 'axios';
import { Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import { toast } from 'react-toastify';


const NavBar = () => {

  const navigate = useNavigate();

  const { user, setUser, isAuthenticated, setIsAuthenticated } = useContext(UserContext);
  
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLogout = async () => {
    try {
      const res = await axios.post("https://blogifybackend-anmol-ramolas-projects.vercel.app/logout", {} , {withCredentials: true});
      setUser(null);
      setIsAuthenticated(false);
      toast.success(res.data.msg);
    } catch (error) {
      if(error.response.status === 402){
        setUser(null);
        setIsAuthenticated(false);
        toast.error(error.response.data.msg);
        navigate('/login');
      }
      console.log(error);
    }
  }


  //relative w-full bg-white mt-3
  return (
    <div style={{"box-shadow": "5px 2px 5px 2px rgb( 0 0 0/ 0.6)"}} className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
        <div className="inline-flex items-center space-x-2">
            <span>
                <img
                    src="https://www.reshot.com/preview-assets/icons/GBS74MN5VQ/blogging-GBS74MN5VQ.svg"
                    alt="Logo"
                    width="30"
                    height="30"
                />
            </span>
            <span className="font-bold">BLOGIFY</span>
        </div>
        <div className="hidden lg:block">
            <ul className="ml-12 inline-flex space-x-8">
                <li>
                    <Link
                    to="/"
                    className="inline-flex items-center text-sm font-semibold text-gray-800 hover:text-gray-900"
                    >
                        HOME
                    </Link>
                </li>
                <li>
                    <Link
                    to="/about"
                    className="inline-flex items-center text-sm font-semibold text-gray-800 hover:text-gray-900"
                    >
                        ABOUT
                    </Link>
                </li>
                <li>
                    <Link
                    to="/contact"
                    className="inline-flex items-center text-sm font-semibold text-gray-800 hover:text-gray-900"
                    >
                        CONTACT
                    </Link>
                </li>
            </ul>
        </div>
        <div className="flex grow justify-end">
        <button onClick={() => {navigate('/create')}}
            type="button"
            className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black mr-4"
            >
            Create Blog
            </button>
          {isAuthenticated?
            <button onClick={handleLogout}
            type="button"
            className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black mr-4"
            >
            LOGOUT
            </button>
          :
            <button onClick={() => {navigate('/login')}}
            type="button"
            className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black mr-4"
            >
            LOGIN
            </button>            
          }
        </div>
        
        <div className="ml-2 mt-2 hidden lg:block">
          {isAuthenticated?
          <span className="relative inline-block">
            <img
              className="h-10 w-10 rounded-full"
              src={user.profileImageUrl}
              alt={user.fullName}
            />
            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-600 ring-2 ring-white"></span>
          </span>
          :
          <></>  
          }
        </div>
        <div className="ml-2 lg:hidden">
          <Menu onClick={toggleMenu} className="h-6 w-6 cursor-pointer" />
        </div>
        {isMenuOpen && (
          <div className="absolute inset-x-0 top-0 z-50 origin-top-right transform p-2 transition lg:hidden">
            <div className="divide-y-2 divide-gray-50 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="px-5 pb-6 pt-5">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center space-x-2">
                    <span>
                        <img
                        src="https://www.reshot.com/preview-assets/icons/GBS74MN5VQ/blogging-GBS74MN5VQ.svg"
                        alt="Logo"
                        width="30"
                        height="30"
                        />
                    </span>
                    <span className="font-bold">BLOGIFY</span>
                  </div>
                  <div className="-mr-2">
                    <button
                      type="button"
                      onClick={toggleMenu}
                      className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                    >
                      <span className="sr-only">Close menu</span>
                      <X className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <div className="mt-6">
                    <nav className="grid gap-y-4">
                        <Link
                        to="/"
                        className="-m-3 flex items-center rounded-md p-3 text-sm font-semibold hover:bg-gray-50"
                        >
                        <span className="ml-3 text-base font-medium text-gray-900">
                        Home
                        </span>
                        </Link>

                        <Link
                        to="/about"
                        className="-m-3 flex items-center rounded-md p-3 text-sm font-semibold hover:bg-gray-50"
                        >
                        <span className="ml-3 text-base font-medium text-gray-900">
                        About
                        </span>
                        </Link>

                        <Link
                        to="/contact"
                        className="-m-3 flex items-center rounded-md p-3 text-sm font-semibold hover:bg-gray-50"
                        >
                        <span className="ml-3 text-base font-medium text-gray-900">
                        Contact
                        </span>
                        </Link>
                    </nav>
                </div>
                {isAuthenticated?
                  <div className="ml-3 mt-4 flex items-center space-x-2">
                    <img
                    className="inline-block h-10 w-10 rounded-full"
                    src={user.profileImageUrl}
                    alt={user.fullName}
                    />
                    <span className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">{user.fullName}</span>
                    <span className="text-sm font-medium text-gray-500">{user.email}</span>
                    </span>
                  </div>
                  :
                  <></>  
                }
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default NavBar;