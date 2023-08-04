import React from 'react'
import JsonData from '../../Json-file/collectionlist.json';
import FootCard from '../foodcard/foodcard';
import DiningImage from '../../Images/dining-bills.jpg'

function dininglist() {
    const data = JsonData.sectionresult;
    return (
        <div>
          <img src={DiningImage} alt='check out bar'/>
        <p className="text-4xl font-large ml-6 pt-4">Trending dining restaurants in Kolkata</p>
        <div className="flex flex-wrap justify-between mt-10"> 
          {data.map((item, index) => (
            <div key={index} className="w-1/3 p-4"> 
              <FootCard
                name={item.info.name}
                src={item.info.image.url}
                text={item.info.cuisine}
                rating={item.info.rating.aggregate_rating}
                quantity={item.info.costText.text}
                time={item.info.distance}
              />
            </div>
          ))}
        </div>
        </div>
      );
}

export default dininglist