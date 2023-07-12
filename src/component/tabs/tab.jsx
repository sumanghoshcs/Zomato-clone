import React from 'react'

function tab() {
  return (
    <>
    <div className='flex flex-row mt-10 text-xl font-medium gap-16 text-slate-500 tracking-wide'>
  <div className='flex items-center'>
    <div className='border-solid border-2 rounded-full p-4 bg-slate-50'>
    <img src='https://b.zmtcdn.com/data/o2_assets/246bbd71fbba420d5996452be3024d351616150055.png' alt='delivery' className='w-7 h-7' />
    </div>
    <p className='ml-2'>Delivery</p>
  </div>
  <div className='flex items-center ml-4'>
    <div className='border-solid border-2 rounded-full p-4 bg-slate-50'>
    <img src='https://b.zmtcdn.com/data/o2_assets/78d25215ff4c1299578ed36eefd5f39d1616149985.png' alt='diningout' className='w-7 h-7' />
    </div>
    <p className='ml-2'>Dining Out</p>
  </div>
  <div className='flex items-center ml-4'>
    <div className='border-solid border-2 rounded-full p-4 bg-slate-50'>
    <img src='https://b.zmtcdn.com/data/o2_assets/01040767e4943c398e38e3592bb1ba8a1616150142.png' alt='nightlife' className='w-7 h-7' />
    </div>
    <p className='ml-2'>Nightlife</p>
  </div>
</div>
<div className="w-full border-b-2 border-gray-100 mt-4"></div>
</>
  )
}

export default tab