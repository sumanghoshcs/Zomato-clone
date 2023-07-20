import React from 'react'

function boxcard(props) {
  return (
    <div className='flex flex-col'>
    <div className="w-40 h-44">
    <img src={props.src} alt={props.name} className='h-full w-full'/>
    </div>
</div>
  )
}

export default boxcard;