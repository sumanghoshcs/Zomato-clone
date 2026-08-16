import React from "react";
import JsonData from "../../Json-file/firstorder.json";
import Roundcard from "../card/roundcard";
import ImageCrouser from "../imagecrouser/crouser";

const FirstOrder = () => {
  const data = JsonData.foods;
  return (
    <div className="mt-8 md:mt-12">
      <p className="text-2xl md:text-3xl font-medium ml-2 md:ml-8">
        Inspiration for your first order
      </p>
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

export default FirstOrder;
