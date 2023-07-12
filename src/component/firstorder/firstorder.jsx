import React from 'react';
import JsonData from '../../Json-file/firstorder.json';
import Roundcard from '../card/roundcard';
import ImageCrouser from '../imagecrouser/crouser';

const FirstOrder = () => {
  const data = JsonData.foods; // Access the "foods" array from the JSON data
  return (
    <div className="mt-10 bg-slate-50 w-full h-80">
      <p className="text-3xl font-medium ml-8 pt-6 mt-20">Inspiration for your first order</p>
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

export default FirstOrder;
