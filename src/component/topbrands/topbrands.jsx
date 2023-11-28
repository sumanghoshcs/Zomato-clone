import React from 'react';
import JsonData from '../../Json-file/brands.json';
import Roundcard from '../card/roundcard';
import ImageCrouser from '../imagecrouser/crouser';

const TopBrands = () => {
  const data = JsonData.brands; // Access the "foods" array from the JSON data

  return (
    <div className="mt-4 w-full h-96">
      <p className="text-3xl font-medium ml-8 mt-8">Top brands for you</p>
      <ImageCrouser >
          {data.map((item, index) => (
            <div key={index} className="">
              <Roundcard name={item.name} src={item.imageSrc} />
            </div>
          ))}
      </ImageCrouser>
    </div>
  );
};
export default TopBrands;