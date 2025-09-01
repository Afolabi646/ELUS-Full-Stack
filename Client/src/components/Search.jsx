import React, { useEffect, useState } from 'react'
import { IoSearch } from "react-icons/io5";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { TypeAnimation } from "react-type-animation";
import { FaArrowLeft } from "react-icons/fa";
import useMobile from '../hooks/UseMobile';

const Search = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isSearchPage, setIsSearchPage] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const isMobile = useMobile()
  const params = useLocation()
  const searchText = params.search.slice(3)

  useEffect(()=>{
    const isSearch = location.pathname === "/search";
    setIsSearchPage(isSearch)
  },[location])

  const redirectToSearchPage = () =>{
    navigate("/search")
  }

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/search?q=${searchQuery}`)
  }

  const handleChange = (e)=>{
    const value = e.target.value
    const url = `/search?q=${value}`;
    navigate(url)
  }

  return (
    <div className="w-full min-w-[300px] lg:min-w-[420px] h-11 lg:h-12 rounded-lg border overflow-hidden flex items-center text-neutral-500 bg-slate-50 focus-within:border-yellow-200">
      <div>
        {isMobile && isSearchPage ? (
          <Link to={"/"} className="flex justify-center items-center h-full p-1 m-1 focus-within:border-red-200 rounded bg-black-300">
            <FaArrowLeft size={20} />
          </Link>
        ) : (
          <button className="flex justify-center items-center h-full p-3 group-focus-within:border-red-200">
            <IoSearch size={22} />
          </button>
        )}
      </div>
      <div className="w-full h-full">
        {!isSearchPage ? (
          // not in search page
          <div onClick={redirectToSearchPage} className="w-full h-full flex items-center" >
            <TypeAnimation
              sequence={[
                // Same substring at the start will only be typed out once, initially
                "Search Groceries",
                1000,
                // wait 1s before replacing "Mice" with "Hamsters"
                "Search Cosmetics",
                1000,
                "Search Snacks",
                1000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </div>
        ) : (
          //in search page
          <div className="w-full h-full">
            <input
              type="text"
              placeholder="search for any product"
              autoFocus
              defaultValue={searchText}
              className="bg-transparent w-full h-full outline-none"
              onChange={handleChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Search
