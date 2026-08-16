import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItem, incrementQuantity } from "../component/foodcard/data/cartSlice";
import VegMark from "./VegMark";
import { toast } from "./Toast";

export const MenuCard = React.memo(function MenuCard({ item, restaurant }) {
  const dispatch = useDispatch();
  const cartItem = useSelector((state) =>
    state.cart.items.find((i) => i.id === item.id)
  );

  const handleAdd = () => {
    if (!restaurant) return;
    dispatch(addItem({ ...item, restaurantId: restaurant.id }));
    toast(`${item.name} added to cart`);
  };

  const handleIncrement = () => {
    dispatch(incrementQuantity(item.id));
  };

  return (
    <div className="flex gap-4 py-5 border-b border-gray-100 group">
      <div className="flex-1 min-w-0">
        <VegMark veg={item.veg} />
        <h4 className="text-base font-medium text-gray-800 mt-1.5">{item.name}</h4>
        <p className="text-sm text-gray-500 mt-1">₹{item.price}</p>
        {item.bestseller && (
          <p className="text-xs text-zomato font-semibold mt-1.5">
            ★ Bestseller
          </p>
        )}
        {item.rating && (
          <p className="text-xs text-gray-400 mt-1.5">
            ★ {item.rating} ({item.votes}+ ratings)
          </p>
        )}
        <p className="text-sm text-gray-500 mt-2 leading-relaxed line-clamp-2">
          {item.desc}
        </p>
      </div>
      <div className="relative shrink-0 self-start">
        <div className="h-28 w-28 md:h-32 md:w-32 rounded-2xl overflow-hidden bg-gray-100">
          <img
            src={item.img}
            alt={item.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-3">
          {cartItem ? (
            <button
              className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-2 py-1.5 shadow-md"
              onClick={handleIncrement}
              aria-label="Increase quantity"
            >
              <span className="text-zomato text-xl leading-none font-semibold">+</span>
              <span className="text-zomato text-sm font-semibold">{cartItem.quantity}</span>
              <span className="text-zomato text-xl leading-none font-semibold">+</span>
            </button>
          ) : (
            <button
              className="rounded-lg border border-gray-200 bg-white px-6 py-1.5 text-sm font-semibold text-zomato shadow-md hover:shadow-lg transition-shadow"
              onClick={handleAdd}
            >
              ADD
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

export default MenuCard;
