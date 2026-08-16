import React from 'react';
import JsonData from '../../Json-file/brands.json';
import Roundcard from '../card/roundcard';
import ImageCrouser from '../imagecrouser/crouser';

const TopBrands = () => {
  const data = JsonData.brands;

  return (
    <div className="mt-6 md:mt-10">
      <p className="text-2xl md:text-3xl font-medium ml-2 md:ml-8">Top brands for you</p>
      <div className="mt-4 md:mt-6">
        <ImageCrouser>
          {data.map((item, index) => (
            <Roundcard key={index} name={item.name} src={item.imageSrc} />
          ))}
        </ImageCrouser>
      </div>
    </div>
  );
};
export default TopBrands;
