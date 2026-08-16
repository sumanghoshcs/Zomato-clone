import React, { useRef, useEffect } from 'react';

function ImageCrouser({ children }) {
  const boxRef = useRef(null);

  const scrollByAmount = () => {
    return window.innerWidth < 640 ? 160 : 300;
  };

  const pressPrev = () => {
    boxRef.current.scrollBy({ left: -scrollByAmount(), behavior: 'smooth' });
  };

  const pressNext = () => {
    boxRef.current.scrollBy({ left: scrollByAmount(), behavior: 'smooth' });
  };

  useEffect(() => {
    const box = boxRef.current;
    const canScroll = () => box && box.scrollWidth > box.clientWidth + 10;
    if (canScroll()) return;
  }, []);

  return (
    <div className="relative w-full">
      <button
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-xl border border-gray-100 hover:scale-105 transition-transform"
        onClick={pressPrev}
        aria-label="Previous"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div
        ref={boxRef}
        className="flex gap-5 md:gap-8 overflow-x-auto no-scrollbar scroll-smooth py-2 mx-10 md:mx-12"
      >
        {children}
      </div>
      <button
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-xl border border-gray-100 hover:scale-105 transition-transform"
        onClick={pressNext}
        aria-label="Next"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

export default ImageCrouser;
