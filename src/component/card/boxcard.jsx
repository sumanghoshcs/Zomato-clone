import React from 'react'
import { Link } from 'react-router-dom'

function boxcard(props) {
  return (
    <Link to={props.link || "/"} className="relative block h-40 w-60 md:h-52 md:w-72 rounded-xl overflow-hidden shrink-0 group">
      <img
        src={props.src}
        alt={props.name}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="text-lg md:text-xl font-semibold text-white">{props.name}</p>
        <p className="text-sm text-white/80 mt-0.5">{props.places} places</p>
      </div>
    </Link>
  )
}

export default boxcard;
