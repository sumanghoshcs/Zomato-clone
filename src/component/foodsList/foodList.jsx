import React from 'react';
import JsonData from '../../Json-file/food.json';
import FootCard from '../foodcard/foodcard';

const FoodList = () => {
  const data = JsonData.section;

  return (
    <div>
    <p className="text-2xl md:text-4xl font-medium md:font-large ml-2 md:ml-6 pt-4">Best Food in Kolkata</p>
    <div className="flex flex-wrap justify-between mt-4 md:mt-10">
      {data.map((item, index) => (
        <div key={index} className="w-full sm:w-1/2 lg:w-1/3 p-2 md:p-4">
          <FootCard
            id={item.info.resId}
            name={item.info.name}
            src={item.info.image.url}
            text={item.info.cuisine}
            rating={item.info.rating.aggregate_rating}
            quantity={item.info.costText.text}
            time={item.order.deliveryTime}
            distance={item.distance}
            offer={item.bulkOffers?.[0]?.text}
          />
        </div>
      ))}
    </div>
    </div>
  );
};

export default FoodList;
