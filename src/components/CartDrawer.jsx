import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCart,
  selectCartSubtotal,
} from "../component/foodcard/data/cartSlice";
import QuantityStepper from "./QuantityStepper";
import VegMark from "./VegMark";

export function CartDrawer({ open, onClose, restaurant }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const subtotal = useSelector(selectCartSubtotal);

  if (!open) return null;

  const handleClear = () => {
    dispatch(clearCart());
    onClose();
  };

  const goToCart = () => {
    onClose();
    navigate("/cart");
  };

  return (
    <div className="fixed inset-0 z-[120]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">My Cart</h3>
          <button
            className="text-xl text-gray-400 hover:text-gray-700"
            onClick={onClose}
            aria-label="Close cart"
          >
            &times;
          </button>
        </div>

        {restaurant && (
          <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-800 truncate">{restaurant.name}</p>
            <button className="text-xs text-zomato font-semibold mt-0.5" onClick={handleClear}>
              REMOVE ALL
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <ul className="space-y-5">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <VegMark veg={item.veg} />
                    <p className="text-sm font-medium text-gray-800 mt-1 truncate">{item.name}</p>
                    <p className="text-sm text-gray-600 font-medium mt-0.5">
                      ₹{item.price}
                    </p>
                  </div>
                  <QuantityStepper id={item.id} quantity={item.quantity} size="sm" />
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-semibold text-gray-800">₹{subtotal}</span>
            </div>
            <button
              onClick={goToCart}
              className="w-full rounded-lg bg-zomato py-3.5 text-white font-semibold hover:bg-zomato-dark transition-colors"
            >
              VIEW CART →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartDrawer;
