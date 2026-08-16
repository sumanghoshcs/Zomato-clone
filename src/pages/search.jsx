import React, { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { searchRestaurants } from "../data/restaurants";
import { RestaurantCard } from "../components/RestaurantCard";

const SORTS = [
  { id: "relevance", label: "Relevance" },
  { id: "rating", label: "Rating: High to Low" },
  { id: "deliveryTime", label: "Delivery Time" },
  { id: "costLow", label: "Cost: Low to High" },
  { id: "costHigh", label: "Cost: High to Low" },
];

export function SearchPage() {
  const [params] = useSearchParams();
  const query = params.get("q") || "";
  const [sort, setSort] = useState("relevance");

  const results = useMemo(
    () => searchRestaurants(query, { source: "all", sort }),
    [query, sort]
  );

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
        {query ? (
          <>
            Results for &quot;{query}&quot;
          </>
        ) : (
          "Search Restaurants"
        )}
      </h1>
      <p className="text-gray-500 mt-1 mb-6">
        {results.length} restaurant{results.length !== 1 ? "s" : ""} found
      </p>

      {results.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {SORTS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSort(s.id)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                sort === s.id
                  ? "border-zomato text-zomato bg-zomato/5"
                  : "border-gray-300 text-gray-600 hover:border-gray-400"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      {results.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-7xl mb-5">🔍</div>
          <h2 className="text-xl font-semibold text-gray-800">No restaurants found</h2>
          <p className="text-gray-500 mt-2">
            We couldn't find anything matching &quot;{query}&quot;.
          </p>
          <Link to="/" className="inline-block mt-6 rounded-lg bg-zomato px-8 py-3 text-white font-semibold hover:bg-zomato-dark">
            Browse All Restaurants
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
          {results.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchPage;
