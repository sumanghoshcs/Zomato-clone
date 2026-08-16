import React from 'react'
import { Link } from 'react-router-dom'

function roundcard(props) {
  return (
    <Link to={`/search?q=${encodeURIComponent(props.name)}`} className="flex flex-col items-center shrink-0">
      <div className="h-24 w-24 sm:h-28 sm:w-28 md:h-40 md:w-40 rounded-full overflow-hidden border-4 border-white shadow-lg transition-transform hover:scale-105">
        <img src={props.src} alt={props.name} className="h-full w-full object-cover" />
      </div>
      <p className="text-base md:text-2xl font-normal leading-7 md:leading-9 mt-3 md:mt-6 text-gray-800 text-center max-w-36 truncate">
        {props.name}
      </p>
    </Link>
  )
}

export default roundcard
