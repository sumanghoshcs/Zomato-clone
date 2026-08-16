import React from 'react'
import { Link, useLocation } from 'react-router-dom';

function Tab() {
  const { pathname } = useLocation();

  const tabs = [
    {
      to: "/",
      label: "Delivery",
      img: "https://b.zmtcdn.com/data/o2_assets/246bbd71fbba420d5996452be3024d351616150055.png",
      activeImg: "https://b.zmtcdn.com/data/o2_assets/c0bb85d3a6347b2ec070a8db694588261616149578.png",
    },
    {
      to: "/diningout",
      label: "DiningOut",
      img: "https://b.zmtcdn.com/data/o2_assets/78d25215ff4c1299578ed36eefd5f39d1616149985.png",
      activeImg: "https://b.zmtcdn.com/data/o2_assets/855687dc64a5e06d737dae45b7f6a13b1616149818.png",
    },
    {
      to: "/nightlife",
      label: "Nightlife",
      img: "https://b.zmtcdn.com/data/o2_assets/01040767e4943c398e38e3592bb1ba8a1616150142.png",
      activeImg: "https://b.zmtcdn.com/data/o2_assets/855687dc64a5e06d737dae45b7f6a13b1616149818.png",
    },
  ];

  return (
    <>
      <div className="flex mt-6 md:mt-10 text-xl font-medium gap-8 md:gap-16 overflow-x-auto text-slate-500 tracking-wide no-scrollbar">
        {tabs.map((tab) => {
          const active = pathname === tab.to;
          return (
            <div key={tab.to} className="flex items-center shrink-0">
              <div className={`border-solid border-2 rounded-full p-3 md:p-4 bg-slate-50 ${active ? "hidden" : ""}`}>
                <img src={active ? tab.activeImg : tab.img} alt={tab.label} className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <Link to={tab.to}>
                <p className={`ml-2 text-lg md:text-2xl whitespace-nowrap ${active ? "text-zomato" : "hover:text-gray-800"}`}>
                  {tab.label}
                </p>
              </Link>
            </div>
          );
        })}
      </div>
      <div className="w-full border-b-2 border-gray-100 mt-4"></div>
    </>
  );
}

export default Tab;
