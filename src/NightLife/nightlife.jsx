import React from 'react';
import JsonData from '../Json-file/nightlife.json';
import FootCard from '../component/foodcard/foodcard';
import DiningImage from '../Images/dining-bills.jpg'
const DiningOut = () => {
  const data = JsonData.section;

  return (
    <div>
     <img src={DiningImage} alt="dining-bills"/>
    <p className="text-4xl font-large ml-6 pt-4">Nightlife Restaurants in Sector 5, Salt Lake</p>
    <div className="flex flex-wrap justify-between mt-10"> 
      {data.map((item, index) => (
        <div key={index} className="w-1/3 max-sm:w-full max-sm:ml-4 max-lg:w-1/2 p-4"> 
          <FootCard
            name={item.info.name}
            src={item.info.image.url}
            text={item.info.cuisine}
            rating={item.info.rating.aggregate_rating}
            quantity={item.info.costText.text}
            time={item.order.deliveryTime}
            distance ={item.distance}
          />
        </div>
      ))}
    </div>
    </div>
  );
};

export default DiningOut;
