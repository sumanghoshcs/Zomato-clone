import React from 'react';
import JsonData from '../../Json-file/collectionlist.json';
import Boxcard from '../card/boxcard';
import ImageCrouser from '../imagecrouser/crouser';

function collections() {
    const data = JsonData.sectionresult;
    const items = data.slice(0, 8);

    const themes = [
      { name: "Trending Dining", places: "All over Kolkata" },
      { name: "Best Rated", places: "Top rated picks" },
      { name: "Newly Opened", places: "Fresh spots" },
      { name: "Premium Dining", places: "Fine experiences" },
      { name: "Quiet Places", places: "Great for meetings" },
      { name: "Coffee & Dessert", places: "Sweet escapes" },
      { name: "Live Music", places: "Music & vibes" },
      { name: "Brunch Spots", places: "Weekend favourites" },
    ];

    return (
      <div className="bg-slate-50 w-full mt-8 md:mt-12 px-2 md:px-8 py-6 md:py-10">
        <div className="flex flex-wrap items-end justify-between gap-2 mb-5">
          <div>
            <p className="text-2xl md:text-3xl font-medium text-gray-900">Collections</p>
            <p className="text-sm md:text-base text-gray-500 mt-1">
              Explore curated lists of top restaurants, cafés, pubs and bars
            </p>
          </div>
          <a href="/diningout" className="text-zomato font-medium text-sm md:text-base shrink-0">
            All collections in Kolkata ›
          </a>
        </div>
        <ImageCrouser>
          {items.map((item, index) => (
            <Boxcard
              key={index}
              name={themes[index % themes.length].name}
              places={themes[index % themes.length].places}
              src={item.info.image.url}
              link="/diningout"
            />
          ))}
        </ImageCrouser>
      </div>
    );
}

export default collections
