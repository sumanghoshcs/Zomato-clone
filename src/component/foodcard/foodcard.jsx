import React from 'react'

function foodcard(props) {
  return (
    <div class="max-w-sm overflow-hidden p-3 rounded-2xl  hover:shadow-2xl hover:border">
  <img class="w-full h-56 rounded-2xl" src={props.src} alt={props.name} />
  <div className='flex flex-row justify-between'>
  <div class=" py-4">
    <div class=" text-lg text-slate-600 leading-6 mb-2 whitespace-nowrap truncate overflow-ellipsis w-52 font-medium">{props.name}</div>
    <div className='flex flex-row overflow-hidden w-40 gap-1'>
  <p className="text-slate-500 leading-5 text-base max-w-xl truncate overflow-ellipsis">
    {props.text.map((item, index) => (
      <span key={index}>{item.name}, </span>
    ))}
  </p>
</div>

  </div>
  <div class=" py-4">
   <p>{props.rating}</p>
   <p className='whitespace-nowrap'>{props.quantity}</p>
   <p>{props.time}</p>
  </div>
  </div>
</div>

  )
}

export default foodcard