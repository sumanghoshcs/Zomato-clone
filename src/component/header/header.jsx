import React from 'react';
import LocationLogo from '../../Images/location-pin.png';
import Down from '../../Images/down.png';
import Search from '../../Images/magnifying-glass.png';

function Header() {
  return (
    <div className='flex flex-row items-center gap-12 mt-2.5'>
      <div className=''>
  <img src='https://b.zmtcdn.com/web_assets/b40b97e677bc7b2ca77c58c61db266fe1603954218.png' alt='logo' className='h-7 w-40' />
</div>
      <div className='gap-4 flex '>
        <div className='flex items-center border rounded-md py-3 pr-36 bg-white drop-shadow-xl'>
          <img src={LocationLogo} alt='location-logo' className='h-6 w-6' />
          <input
            placeholder='Kolkata'
            className='bg-transparent ml-2 focus:outline-none w-40'
          />
          <img src={Down} alt='down' className='h-6 w-4 ml-2' />
          <img src={Search} alt='search-icon' className='h-8 w-8 ml-2' />
          <input
            placeholder='Search for a resturant, causin or a dish'
            className='bg-transparent ml-2 focus:outline-none w-80'
          />
        </div>
      </div>
      <div className='flex gap-4 text-xl font-normal text-slate-500'>
        <div>Log in</div>
        <div>Sign up</div>
      </div>
    </div>
  );
}

export default Header;

