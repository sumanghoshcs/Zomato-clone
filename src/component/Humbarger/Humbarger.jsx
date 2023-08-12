import React, { useState } from 'react';
import HamburgerImage from "../../Images/hamburger (1).png";
import CloseImage from "../../Images/close.png";

function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className='relative'>
      <button className="hamburger-button" onClick={toggleMenu}>
        <img src={HamburgerImage} alt="hamburger" />
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex">
          <div className="bg-white rounded-lg p-10 w-full h-full">
            <button className="absolute top-2 left-2" onClick={closeMenu}>
              <img src={CloseImage} alt="close" />
            </button>
            <div className="mt-8">
              <button className="block py-2 px-4 text-2xl">SignUp</button>
            </div>
            <div className='mt-5'>
              <button className="block py-2 px-4 text-2xl">LogIn</button>
            </div>
          </div>
        </div>
      )}
      <div className='absolute top-0 right-0'>
        <img src='https://b.zmtcdn.com/web_assets/b40b97e677bc7b2ca77c58c61db266fe1603954218.png' alt='logo' className='h-7 w-40' />
      </div>
    </div>
  );
}

export default HamburgerMenu;
