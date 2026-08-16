import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  removeItem,
  clearCart,
  applyCoupon,
  removeCoupon,
  selectCartSubtotal,
} from "../component/foodcard/data/cartSlice";
import { applyCoupon as computeCoupon, COUPONS } from "../data/coupons";
import { QuantityStepper } from "../components/QuantityStepper";
import { VegMark } from "../components/VegMark";
import { toast, Toaster } from "../components/Toast";

const DELIVERY_FEE = 40;
const FREE_DELIVERY_ABOVE = 199;
const PLATFORM_FEE = 3;
const GST_RATE = 0.05;

export function CartPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const restaurant = useSelector((state) => state.cart.restaurant);
  const coupon = useSelector((state) => state.cart.coupon);
  const subtotal = useSelector(selectCartSubtotal);
  const [codeInput, setCodeInput] = useState("");
  const [couponMsg, setCouponMsg] = useState(null);

  const deliveryFee = subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;
  const gst = Math.round(subtotal * GST_RATE);
  const discount = coupon ? coupon.discount : 0;
  const total = Math.max(0, subtotal + deliveryFee + gst + PLATFORM_FEE - discount);

  const billRows = useMemo(
    () => [
      { label: "Item total", value: `₹${subtotal}` },
      {
        label: "Delivery fee",
        value: deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`,
        free: deliveryFee === 0,
      },
      { label: "GST and Restaurant charges", value: `₹${gst}` },
      { label: "Platform fee", value: `₹${PLATFORM_FEE}` },
    ],
    [subtotal, deliveryFee, gst]
  );

  const handleApplyCoupon = () => {
    const result = computeCoupon(codeInput, subtotal, deliveryFee);
    if (result.valid) {
      dispatch(applyCoupon({ code: codeInput.toUpperCase(), ...result }));
      setCouponMsg({ type: "success", text: `Coupon ${codeInput.toUpperCase()} applied` });
      toast(`Coupon ${codeInput.toUpperCase()} applied`);
    } else {
      setCouponMsg({ type: "error", text: result.reason });
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-24 px-4">
        <div className="text-8xl mb-6">🛒</div>
        <h2 className="text-2xl font-semibold text-gray-800">Your cart is empty</h2>
        <p className="text-gray-500 mt-2">Looks like you haven't added anything yet.</p>
        <Link
          to="/"
          className="inline-block mt-8 rounded-lg bg-zomato px-10 py-3.5 text-white font-semibold hover:bg-zomato-dark transition-colors"
        >
          Browse Restaurants
        </Link>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-2">My Cart</h1>
      <p className="text-sm text-gray-500 mb-6">
        {items.reduce((s, i) => s + i.quantity, 0)} item
        {items.reduce((s, i) => s + i.quantity, 0) > 1 ? "s" : ""} in your cart
      </p>

      {restaurant && (
        <div className="flex items-center gap-4 rounded-xl border border-gray-200 p-4 mb-6 bg-gray-50">
          <img src={restaurant.image} alt={restaurant.name} className="h-14 w-14 rounded-xl object-cover" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-800 truncate">{restaurant.name}</p>
            <p className="text-sm text-gray-500">{restaurant.area} • {restaurant.deliveryTime}</p>
          </div>
          <Link
            to={`/restaurant/${restaurant.id}`}
            className="text-zomato text-sm font-semibold whitespace-nowrap"
          >
            Add more items
          </Link>
        </div>
      )}

      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <ul className="divide-y divide-gray-100">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 py-4">
                <div className="h-16 w-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  <img src={item.img} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <VegMark veg={item.veg} />
                  </div>
                  <p className="font-medium text-gray-800 truncate mt-1">{item.name}</p>
                  <p className="text-sm text-gray-600 font-medium">₹{item.price}</p>
                </div>
                <QuantityStepper id={item.id} quantity={item.quantity} />
                <button
                  onClick={() => dispatch(removeItem(item.id))}
                  className="text-gray-400 hover:text-zomato text-xl px-2"
                  aria-label={`Remove ${item.name}`}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={() => dispatch(clearCart())}
            className="mt-4 text-zomato text-sm font-semibold hover:underline"
          >
            Clear cart
          </button>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-gray-200 p-5 md:p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Bill Details</h3>
            <ul className="space-y-2.5 text-sm">
              {billRows.map((row) => (
                <li key={row.label} className="flex justify-between">
                  <span className="text-gray-500">{row.label}</span>
                  <span className={row.free ? "text-green-700 font-semibold" : "text-gray-700 font-medium"}>
                    {row.value}
                  </span>
                </li>
              ))}
              {discount > 0 && (
                <li className="flex justify-between text-green-700">
                  <span>Coupon discount</span>
                  <span className="font-semibold">-₹{discount}</span>
                </li>
              )}
            </ul>
            <div className="mt-4 flex justify-between border-t border-gray-200 pt-4">
              <span className="font-semibold text-gray-800">To Pay</span>
              <span className="font-bold text-gray-800 text-lg">₹{total}</span>
            </div>

            <div className="mt-6">
              <p className="text-sm font-semibold text-gray-700 mb-2">Apply Coupon</p>
              <div className="flex gap-2">
                <input
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  placeholder="Enter coupon code"
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zomato uppercase"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="rounded-lg bg-gray-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 transition-colors"
                >
                  Apply
                </button>
              </div>
              {couponMsg && (
                <p className={`text-xs mt-2 ${couponMsg.type === "success" ? "text-green-700" : "text-red-600"}`}>
                  {couponMsg.text}
                </p>
              )}
              {coupon && (
                <button
                  onClick={() => dispatch(removeCoupon())}
                  className="text-xs text-zomato font-semibold mt-2 hover:underline"
                >
                  Remove coupon {coupon.code}
                </button>
              )}
            </div>

            <div className="mt-5 space-y-2">
              <p className="text-xs font-semibold text-gray-400">AVAILABLE COUPONS</p>
              {COUPONS.map((c) => (
                <button
                  key={c.code}
                  onClick={() => {
                    setCodeInput(c.code);
                    setCouponMsg(null);
                  }}
                  className="flex w-full items-center gap-3 rounded-lg border border-gray-200 p-3 text-left hover:border-zomato transition-colors"
                >
                  <span className="text-zomato text-lg">★</span>
                  <span>
                    <span className="block text-sm font-semibold text-gray-800">{c.label}</span>
                    <span className="block text-xs text-gray-500">{c.code}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="mt-4 w-full rounded-xl bg-zomato py-4 text-lg font-semibold text-white hover:bg-zomato-dark transition-colors"
          >
            Proceed to Checkout →
          </button>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default CartPage;
