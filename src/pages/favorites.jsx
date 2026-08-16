import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RESTAURANTS } from "../data/restaurants";
import { RestaurantCard } from "../components/RestaurantCard";

export function Favorites() {
  const favorites = useSelector((state) => state.user.favorites);
  const restaurants = RESTAURANTS.filter((r) =>
    favorites.includes(String(r.id))
  );

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">Favourites</h1>
      <p className="text-gray-500 mt-1 mb-6">
        {restaurants.length} favourite restaurant{restaurants.length !== 1 ? "s" : ""}
      </p>

      {restaurants.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-7xl mb-5">💖</div>
          <h2 className="text-xl font-semibold text-gray-800">No favourites yet</h2>
          <p className="text-gray-500 mt-2">
            Tap the heart on any restaurant to save it here.
          </p>
          <Link to="/" className="inline-block mt-6 rounded-lg bg-zomato px-8 py-3 text-white font-semibold hover:bg-zomato-dark">
            Discover Restaurants
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
