import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getRestaurantById } from "../data/restaurants";
import { setRestaurant, selectCartCount, selectCartSubtotal } from "../component/foodcard/data/cartSlice";
import { toggleFavorite } from "../redux/userSlice";
import { MenuCard } from "../components/MenuCard";
import { Stars } from "../components/Stars";
import { CartDrawer } from "../components/CartDrawer";
import { Toaster } from "../components/Toast";

const RestaurantMap = React.lazy(() => import("../components/RestaurantMap"));

export function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const restaurant = useMemo(() => getRestaurantById(id), [id]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const cartCount = useSelector(selectCartCount);
  const subtotal = useSelector(selectCartSubtotal);
  const isFav = useSelector((state) =>
    state.user.favorites.includes(String(id))
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (restaurant) {
      dispatch(
        setRestaurant({
          id: restaurant.id,
          name: restaurant.name,
          image: restaurant.image,
          deliveryTime: restaurant.deliveryTime,
          area: restaurant.area,
        })
      );
    }
  }, [restaurant, dispatch]);

  if (!restaurant) {
    return (
      <div className="text-center py-24 px-4">
        <img
          src="https://b.zmtcdn.com/images/z404x2.png?output-format=webp"
          alt="Not found"
          className="mx-auto w-72"
        />
        <h2 className="text-2xl font-semibold mt-6">Restaurant not found</h2>
        <button
          onClick={() => navigate("/")}
          className="mt-6 rounded-lg bg-zomato px-8 py-3 text-white font-semibold hover:bg-zomato-dark"
        >
          Go to Homepage
        </button>
      </div>
    );
  }

  const searchParams = new URLSearchParams(location.search);
  const from = searchParams.get("from");

  const handleFav = () => {
    dispatch(toggleFavorite(restaurant.id));
  };

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
    document.getElementById(`menu-${cat}`)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="pb-28">
      <div className="relative">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-52 md:h-80 object-cover"
        />
        <button
          onClick={() => navigate(from === "cart" ? "/cart" : "/")}
          className="absolute top-4 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-100"
          aria-label="Go back"
        >
          ←
        </button>
        <button
          onClick={handleFav}
          className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-100"
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
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 mt-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
              {restaurant.name}
            </h1>
            <p className="text-sm text-gray-500 mt-1.5">{restaurant.cuisines.join(", ")}</p>
            <p className="text-sm text-gray-500 mt-0.5">{restaurant.area}</p>
          </div>
          <div className="flex items-center gap-3">
            <Stars rating={restaurant.rating} large />
            <div className="border-l border-gray-300 pl-3">
              <p className="text-sm font-semibold text-gray-700">
                {parseFloat(restaurant.rating) > 3.9 ? "Very Good" : "Good"}
              </p>
              <p className="text-xs text-gray-500">{restaurant.votes} ratings</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-5 text-sm text-gray-600 border-y border-dashed border-gray-300 py-3">
          <span className="font-medium text-green-700">🛵</span>
          <span className="font-medium">{restaurant.deliveryTime} • {restaurant.distance}</span>
          <span className="font-medium">{restaurant.costForOne.replace(/for two/, "for one")}</span>
        </div>

        <div className="mt-4 rounded-xl border border-dashed border-zomato bg-zomato/5 px-4 py-3">
          <p className="text-xs font-bold tracking-wider text-zomato">OFFERS</p>
          <ul className="mt-1.5 space-y-1">
            {restaurant.offers.map((offer, i) => (
              <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                <span className="text-zomato">★</span> {offer}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Location & Map</h2>
          <React.Suspense fallback={<div className="h-52 rounded-2xl bg-[#1c1c20] border border-gray-700 animate-pulse" />}>
            <RestaurantMap
              lat={restaurant.lat}
              lng={restaurant.lng}
              name={restaurant.name}
              height="h-52 md:h-64"
              zoom={14}
            />
          </React.Suspense>
          {restaurant.address && (
            <p className="text-sm text-gray-500 mt-2">{restaurant.address}</p>
          )}
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
        </div>

        <div className="mt-2 flex flex-col md:flex-row gap-8">
          <aside className="hidden md:block w-56 shrink-0">
            <ul className="sticky top-4 space-y-1">
              {restaurant.menu.map((group) => (
                <li key={group.category}>
                  <button
                    onClick={() => handleCategoryClick(group.category)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeCategory === group.category
                        ? "text-zomato bg-zomato/5"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    {group.category}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <div className="flex-1 min-w-0">
            {restaurant.menu.map((group) => (
              <section key={group.category} id={`menu-${group.category}`} className="scroll-mt-4">
                <h3 className="text-xl font-semibold text-gray-800 pt-2">
                  {group.category}
                </h3>
                <p className="text-sm text-gray-400 mb-1">
                  {group.items.length} items
                </p>
                {group.items.map((item) => (
                  <MenuCard key={item.id} item={item} restaurant={restaurant} />
                ))}
              </section>
            ))}
          </div>
        </div>
      </div>

      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-[100] md:bottom-6 md:left-auto md:right-6 md:w-96">
          <button
            onClick={() => setCartOpen(true)}
            className="mx-4 mb-4 md:mx-0 md:mb-0 flex items-center justify-between rounded-xl bg-zomato px-5 py-4 text-white shadow-2xl w-auto md:rounded-full hover:bg-zomato-dark transition-colors"
          >
            <span className="flex items-center gap-3">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
              <span className="text-lg font-semibold">{cartCount} item{cartCount > 1 ? "s" : ""}</span>
            </span>
            <span className="text-lg font-semibold">₹{subtotal} ›</span>
          </button>
        </div>
      )}

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} restaurant={restaurant} />
      <Toaster />
    </div>
  );
}

export default RestaurantDetail;
