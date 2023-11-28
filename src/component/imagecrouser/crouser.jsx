import React, { useRef } from 'react';

function ImageCrouser({ children }) {
  const boxRef = useRef(null);

  const pressPrev = () => {
    const newWidth = 180;
    boxRef.current.scrollLeft -= newWidth;
  };

  const pressNext = () => {
    const newWidth = 180;
    boxRef.current.scrollLeft += newWidth;
  };

  return (
    <div className='relative overflow-visible max-md:static w-full h-60 flex flex-row mt-6 md:flex-col'>
      <button className='border rounded-full p-1 w-10 h-10 absolute left-0 mt-20 bg-white drop-shadow-2xl max-md:hidden' onClick={pressPrev}>
        <p>&lt;</p>
      </button>
      <div className='flex flex-row mt-1 gap-8 overflow-x-scroll overflow-y-hidden h-80 scroll-smooth mx-4 md:overflow-hidden' ref={boxRef}>
        {children}
      </div>
      <button className='border rounded-full p-1 w-10 h-10 absolute right-0 mt-20 bg-white drop-shadow-2xl max-md:hidden' onClick={pressNext}>
        <p>&gt;</p>
      </button>
    </div>
  );
}

export default ImageCrouser;
