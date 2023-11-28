import React from 'react'

function roundcard(props) {
  return (
    <div className='flex flex-col items-center'>
        <div className="w-40 h-40 bg-gray-300 max-md:w-24 max-md:h-24 rounded-full overflow-hidden">
        <img src={props.src} alt={props.name} />
        </div>
        <p className='text-2xl font-normal leading-9 mt-6'>{props.name}</p>
    </div>
  )
}


export default roundcard
