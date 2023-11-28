import React from 'react';
import JsonData from '../../Json-file/collections.json';
import Boxcard from '../card/boxcard';
import ImageCrouser from '../imagecrouser/crouser';

function collections() {
    const data = JsonData.collections; // Access the "foods" array from the JSON data
    return (
      <div className="bg-slate-50 w-full h-full p-4 mt-10">
        <p className="text-3xl font-medium">Collections</p>
        <ImageCrouser >
            {data.map((item, index) => (
              <div key={index} className="">
                <Boxcard name={item.name} src={item.flagImgUrl} />
              </div>
            ))}
        </ImageCrouser>
      </div>
    );
}

export default collections