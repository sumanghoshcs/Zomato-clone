import React from 'react'
import { Link } from 'react-router-dom'
import FirstOrder from '../component/firstorder/firstorder';
import TopBrands from '../component/topbrands/topbrands';
import FoodList from '../component/foodsList/foodList';

const CUISINES = [
  "Biryani",
  "Pizza",
  "Burger",
  "Chinese",
  "North Indian",
  "Momos",
  "Ice Cream",
  "Rolls",
];

function delivery() {
  return (
    <>
      <FirstOrder />
      <TopBrands />
      <div className="mt-6 md:mt-10 px-2 md:px-8">
        <p className="text-2xl md:text-3xl font-medium text-gray-900">
          Order online from your favourite places
        </p>
        <div className="mt-4 flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {CUISINES.map((c) => (
            <Link
              key={c}
              to={`/search?q=${encodeURIComponent(c)}`}
              className="shrink-0 rounded-full border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:border-zomato hover:text-zomato transition-colors"
            >
              {c}
            </Link>
          ))}
        </div>
      </div>
      <FoodList />
    </>
  )
}

export default delivery
