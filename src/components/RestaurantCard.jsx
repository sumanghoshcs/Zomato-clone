import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Stars } from "./Stars";
import { toggleFavorite } from "../redux/userSlice";

export const RestaurantCard = React.memo(function RestaurantCard({ restaurant }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isFav = useSelector((state) =>
    state.user.favorites.includes(String(restaurant.id))
  );

  const handleFav = (e) => {
    e.stopPropagation();
    dispatch(toggleFavorite(restaurant.id));
  };

  return (
    <div
      className="group cursor-pointer rounded-2xl p-3 hover:shadow-xl hover:border hover:border-gray-200 transition-all relative"
      onClick={() => navigate(`/restaurant/${restaurant.id}`)}
    >
      <div className="relative overflow-hidden rounded-2xl">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <button
          onClick={handleFav}
          className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white"
          aria-label="Toggle favourite"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill={isFav ? "#e23744" : "none"}
            stroke={isFav ? "#e23744" : "#666"}
            strokeWidth="2"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
        {restaurant.promoted && (
          <span className="absolute top-3 left-3 rounded bg-white/90 px-2 py-1 text-xs font-semibold text-gray-700">
            AD
          </span>
        )}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <span className="text-white text-sm font-semibold">{restaurant.offers[0]}</span>
        </div>
      </div>
      <div className="pt-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-lg text-gray-800 truncate">{restaurant.name}</h3>
          <Stars rating={restaurant.rating} />
        </div>
        <p className="text-sm text-gray-500 mt-1 truncate">{restaurant.cuisines.join(", ")}</p>
        <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
          <span>{restaurant.deliveryTime}</span>
          <span>{restaurant.distance}</span>
          <span className="text-gray-400">₹{restaurant.costForOne.replace(/[^\d]/g, "")} for one</span>
        </div>
      </div>
    </div>
  );
});

export default RestaurantCard;
