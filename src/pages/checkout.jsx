import React, { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCart,
  selectCartSubtotal,
} from "../component/foodcard/data/cartSlice";
import { placeOrder } from "../redux/ordersSlice";
import { onAuthModalOpen } from "../components/modalBus";
import { toast, Toaster } from "../components/Toast";

const RestaurantMap = lazy(() => import("../components/RestaurantMap"));

const DELIVERY_FEE = 40;
const FREE_DELIVERY_ABOVE = 199;
const PLATFORM_FEE = 3;
const GST_RATE = 0.05;
const RAZORPAY_KEY_ID = process.env.REACT_APP_RAZORPAY_KEY_ID || "";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zomato";

const PAY_METHODS = [
  { id: "cod", label: "Cash on Delivery", icon: "💵", desc: "Pay when your food arrives" },
  { id: "upi", label: "UPI", icon: "📱", desc: "Google Pay, PhonePe, Paytm & more" },
  { id: "card", label: "Credit / Debit Card", icon: "💳", desc: "Visa, Mastercard, RuPay" },
  { id: "netbanking", label: "Net Banking", icon: "🏦", desc: "All major banks supported" },
  { id: "wallet", label: "Zomato Wallet", icon: "💰", desc: "Wallet balance: ₹1,000" },
];

const BANKS = [
  "State Bank of India",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Kotak Mahindra Bank",
  "Punjab National Bank",
];

export function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const restaurant = useSelector((state) => state.cart.restaurant);
  const coupon = useSelector((state) => state.cart.coupon);
  const subtotal = useSelector(selectCartSubtotal);
  const user = useSelector((state) => state.user.user);

  const [address, setAddress] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    flat: "",
    street: "",
    city: "Kolkata",
    pincode: "",
    type: "Home",
  });
  const [deliveryWhen, setDeliveryWhen] = useState("now");
  const [payment, setPayment] = useState("cod");
  const [upiId, setUpiId] = useState("");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [bank, setBank] = useState("");
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);
  const [mapPin, setMapPin] = useState(null);

  useEffect(() => {
    if (items.length === 0 && !placing) {
      navigate("/cart", { replace: true });
    }
  }, [items.length, navigate, placing]);

  useEffect(() => {
    if (!address.flat.trim() || !address.street.trim() || !address.pincode.trim()) {
      setMapPin(null);
      return;
    }
    const q = `${address.flat.trim()}, ${address.street.trim()}, ${address.city.trim()}, ${address.pincode.trim()}, India`;
    const t = setTimeout(() => {
      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`
      )
        .then((r) => r.json())
        .then((arr) => {
          if (arr && arr[0]) {
            setMapPin({ lat: parseFloat(arr[0].lat), lng: parseFloat(arr[0].lon) });
          } else {
            setMapPin(null);
          }
        })
        .catch(() => setMapPin(null));
    }, 700);
    return () => clearTimeout(t);
  }, [address.flat, address.street, address.city, address.pincode]);

  const deliveryFee = subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;
  const gst = Math.round(subtotal * GST_RATE);
  const discount = coupon ? coupon.discount : 0;
  const total = Math.max(0, subtotal + deliveryFee + gst + PLATFORM_FEE - discount);

  const validateAddress = () => {
    const errs = {};
    if (!address.name.trim()) errs.name = "Name is required";
    if (!/^\d{10}$/.test(address.phone)) errs.phone = "Enter a valid 10-digit phone number";
    if (!address.flat.trim()) errs.flat = "Flat / house number is required";
    if (!address.street.trim()) errs.street = "Street / area is required";
    if (!/^\d{6}$/.test(address.pincode)) errs.pincode = "Enter a valid 6-digit pincode";
    if (payment === "upi" && !/^[\w.-]{2,}@[a-zA-Z]{2,}$/.test(upiId))
      errs.upi = "Enter a valid UPI ID (e.g. name@upi)";
    if (payment === "card") {
      const num = card.number.replace(/\s/g, "");
      if (!/^\d{16}$/.test(num)) errs.cardNumber = "Enter a valid 16-digit card number";
      if (!card.name.trim()) errs.cardName = "Name on card is required";
      if (!/^\d{2}\/\d{2}$/.test(card.expiry)) errs.cardExpiry = "Expiry must be MM/YY";
      if (!/^\d{3,4}$/.test(card.cvv)) errs.cardCvv = "Invalid CVV";
    }
    if (payment === "netbanking" && !bank) errs.bank = "Select a bank";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const formatCardNumber = (v) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
  const formatExpiry = (v) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d;
  };

  const handleCardChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;
    if (name === "number") value = formatCardNumber(value);
    if (name === "expiry") value = formatExpiry(value);
    if (name === "cvv") value = value.replace(/\D/g, "").slice(0, 4);
    setCard({ ...card, [name]: value });
  };

  const buildOrder = (paymentId) => ({
    id: "ZO" + Date.now().toString().slice(-8),
    restaurant: {
      id: restaurant?.id,
      name: restaurant?.name || "Restaurant",
      image: restaurant?.image || "",
      area: restaurant?.area || "",
    },
    items: items.map((i) => ({
      id: i.id,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      veg: i.veg,
      img: i.img,
    })),
    bill: {
      itemTotal: subtotal,
      deliveryFee,
      gst,
      platformFee: PLATFORM_FEE,
      discount,
      total,
    },
    coupon: coupon ? { code: coupon.code, label: coupon.label } : null,
    paymentMethod: PAY_METHODS.find((p) => p.id === payment)?.label || payment,
    address: { ...address },
    deliveryWhen,
    status: "Placed",
    placedAt: new Date().toISOString(),
    estimatedTime: restaurant?.deliveryTime || "35 min",
    paymentId: paymentId || null,
  });

  const finishOrder = (order) => {
    dispatch(placeOrder(order));
    dispatch(clearCart());
    navigate(`/order-success/${order.id}`, { replace: true });
  };

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });

  const handlePlaceOrder = async () => {
    if (!validateAddress()) {
      toast("Please fix the highlighted fields", "error");
      return;
    }
    const order = buildOrder();
    const useSimulated = payment === "cod" || !RAZORPAY_KEY_ID;
    if (useSimulated) {
      setPlacing(true);
      setTimeout(() => finishOrder(order), 2200);
      return;
    }
    const loaded = await loadRazorpayScript();
    if (!loaded || !window.Razorpay) {
      setPlacing(true);
      setTimeout(() => finishOrder(order), 2200);
      return;
    }
    const options = {
      key: RAZORPAY_KEY_ID,
      amount: Math.round(total * 100),
      currency: "INR",
      name: restaurant?.name || "Zomato Clone",
      description: `Order ${order.id}`,
      prefill: {
        name: address.name,
        contact: address.phone,
        email: user?.email || "",
      },
      notes: {
        address: `${address.flat}, ${address.street}, ${address.city} ${address.pincode}`,
      },
      handler: (response) => {
        finishOrder({ ...order, paymentId: response.razorpay_payment_id });
      },
      modal: {
        ondismiss: () => toast("Payment cancelled", "error"),
      },
      theme: { color: "#e23744" },
    };
    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", () => {
      toast("Payment failed. Please try again.", "error");
    });
    rzp.open();
  };

  const billRows = useMemo(
    () => [
      { label: "Item total", value: `₹${subtotal}` },
      { label: "Delivery fee", value: deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`, free: deliveryFee === 0 },
      { label: "GST and Restaurant charges", value: `₹${gst}` },
      { label: "Platform fee", value: `₹${PLATFORM_FEE}` },
    ],
    [subtotal, deliveryFee, gst]
  );

  if (items.length === 0 && placing) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-2">Checkout</h1>
      <p className="text-sm text-gray-500 mb-6">Complete your order from {restaurant?.name}</p>

      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          {!user && (
            <div className="rounded-xl border-2 border-dashed border-zomato bg-zomato/5 p-4 flex items-center justify-between gap-4">
              <p className="text-sm text-gray-700">
                Have an account? Login for faster checkout.
              </p>
              <button
                onClick={() => onAuthModalOpen()}
                className="rounded-lg bg-zomato px-6 py-2.5 text-sm font-semibold text-white whitespace-nowrap hover:bg-zomato-dark"
              >
                Login
              </button>
            </div>
          )}

          <section className="rounded-2xl border border-gray-200 p-5 md:p-6">
            <h2 className="font-semibold text-gray-800 mb-1">Delivery Address</h2>
            <p className="text-xs text-gray-500 mb-4">
              {user ? `Delivering to ${user.name}` : "Add the address where your food should be delivered"}
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <input name="name" placeholder="Full name" value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} className={inputClass} />
                {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
              </div>
              <div>
                <input name="phone" placeholder="Phone number" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} className={inputClass} />
                {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
              </div>
              <div>
                <input name="flat" placeholder="Flat / House / Building" value={address.flat} onChange={(e) => setAddress({ ...address, flat: e.target.value })} className={inputClass} />
                {errors.flat && <p className="text-xs text-red-600 mt-1">{errors.flat}</p>}
              </div>
              <div>
                <input name="street" placeholder="Street / Area / Landmark" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} className={inputClass} />
                {errors.street && <p className="text-xs text-red-600 mt-1">{errors.street}</p>}
              </div>
              <div>
                <input name="city" placeholder="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className={inputClass} />
              </div>
              <div>
                <input name="pincode" placeholder="Pincode" value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })} className={inputClass} />
                {errors.pincode && <p className="text-xs text-red-600 mt-1">{errors.pincode}</p>}
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              {["Home", "Office", "Other"].map((t) => (
                <button
                  key={t}
                  onClick={() => setAddress({ ...address, type: t })}
                  className={`rounded-full border px-5 py-2 text-sm font-medium transition-colors ${
                    address.type === t
                      ? "border-zomato text-zomato bg-zomato/5"
                      : "border-gray-300 text-gray-500 hover:border-gray-400"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="mt-4">
              {mapPin ? (
                <>
                  <p className="text-xs text-gray-500 mb-2">
                    Delivery location preview (powered by OpenStreetMap)
                  </p>
                  <Suspense fallback={<div className="h-40 rounded-xl bg-[#1c1c20] border border-gray-700 animate-pulse" />}>
                    <RestaurantMap
                      lat={mapPin.lat}
                      lng={mapPin.lng}
                      name="Delivery location"
                      height="h-40"
                      zoom={14}
                    />
                  </Suspense>
                </>
              ) : (
                address.flat && address.street && address.pincode ? (
                  <div className="h-40 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center">
                    <p className="text-sm text-gray-400">Pinpointing delivery location…</p>
                  </div>
                ) : (
                  <div className="h-40 rounded-xl bg-gray-50 border border-dashed border-gray-300 flex items-center justify-center">
                    <p className="text-sm text-gray-400">Enter a complete address to see the delivery location on a map</p>
                  </div>
                )
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 p-5 md:p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Delivery in</h2>
            <div className="grid grid-cols-2 gap-3 max-w-sm">
              <button
                onClick={() => setDeliveryWhen("now")}
                className={`rounded-xl border p-4 text-left transition-colors ${
                  deliveryWhen === "now" ? "border-zomato bg-zomato/5" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="block text-sm font-semibold text-gray-800">ASAP</span>
                <span className="block text-xs text-gray-500 mt-1">Usually in {restaurant?.deliveryTime || "35 min"}</span>
              </button>
              <button
                onClick={() => setDeliveryWhen("later")}
                className={`rounded-xl border p-4 text-left transition-colors ${
                  deliveryWhen === "later" ? "border-zomato bg-zomato/5" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="block text-sm font-semibold text-gray-800">Schedule</span>
                <span className="block text-xs text-gray-500 mt-1">Pick a future time slot</span>
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 p-5 md:p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Payment Method</h2>
            <div className="space-y-3">
              {PAY_METHODS.map((m) => (
                <div key={m.id}>
                  <button
                    onClick={() => setPayment(m.id)}
                    className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-colors ${
                      payment === m.id ? "border-zomato bg-zomato/5" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className="text-2xl">{m.icon}</span>
                    <span className="flex-1">
                      <span className="block text-sm font-semibold text-gray-800">{m.label}</span>
                      <span className="block text-xs text-gray-500">{m.desc}</span>
                    </span>
                    <span
                      className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                        payment === m.id ? "border-zomato" : "border-gray-300"
                      }`}
                    >
                      {payment === m.id && <span className="h-2.5 w-2.5 rounded-full bg-zomato" />}
                    </span>
                  </button>
                  {payment === m.id && (
                    <div className="mt-3 ml-4">
                      {m.id === "upi" && (
                        <div className="max-w-sm">
                          <input
                            placeholder="Enter UPI ID (e.g. 9876543210@ybl)"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className={inputClass}
                          />
                          {errors.upi && <p className="text-xs text-red-600 mt-1">{errors.upi}</p>}
                          <div className="mt-3 rounded-xl bg-gray-50 p-4 text-center border border-dashed border-gray-300">
                            <p className="text-sm font-semibold text-gray-700">Scan to pay</p>
                            <div className="mx-auto mt-3 grid w-24 grid-cols-3 gap-1 p-2">
                              {Array.from({ length: 49 }).map((_, i) => (
                                <span key={i} className={`h-1.5 rounded-sm ${i % 7 === 0 || i % 9 === 0 ? "bg-zomato/40" : "bg-gray-300/50"}`} />
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                      {m.id === "card" && (
                        <div className="grid sm:grid-cols-2 gap-4 max-w-lg">
                          <div className="sm:col-span-2">
                            <input name="number" placeholder="Card number (16 digits)" value={card.number} onChange={handleCardChange} className={inputClass} />
                            {errors.cardNumber && <p className="text-xs text-red-600 mt-1">{errors.cardNumber}</p>}
                          </div>
                          <div className="sm:col-span-2">
                            <input name="name" placeholder="Name on card" value={card.name} onChange={handleCardChange} className={inputClass} />
                            {errors.cardName && <p className="text-xs text-red-600 mt-1">{errors.cardName}</p>}
                          </div>
                          <div>
                            <input name="expiry" placeholder="MM/YY" value={card.expiry} onChange={handleCardChange} className={inputClass} />
                            {errors.cardExpiry && <p className="text-xs text-red-600 mt-1">{errors.cardExpiry}</p>}
                          </div>
                          <div>
                            <input name="cvv" type="password" placeholder="CVV" value={card.cvv} onChange={handleCardChange} className={inputClass} />
                            {errors.cardCvv && <p className="text-xs text-red-600 mt-1">{errors.cardCvv}</p>}
                          </div>
                        </div>
                      )}
                      {m.id === "netbanking" && (
                        <div className="grid grid-cols-2 gap-3 max-w-lg">
                          {BANKS.map((b) => (
                            <button
                              key={b}
                              onClick={() => setBank(b)}
                              className={`rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
                                bank === b ? "border-zomato bg-zomato/5 text-zomato font-semibold" : "border-gray-200 text-gray-600 hover:border-gray-300"
                              }`}
                            >
                              {b}
                            </button>
                          ))}
                          {errors.bank && <p className="text-xs text-red-600 col-span-2">{errors.bank}</p>}
                        </div>
                      )}
                      {m.id === "wallet" && (
                        <p className="text-sm text-gray-500 max-w-sm">
                          Your wallet balance is ₹1,000. The payable amount will be deducted on confirmation.
                        </p>
                      )}
                      {m.id === "cod" && (
                        <p className="text-sm text-gray-500 max-w-sm">
                          Keep cash ready. Our delivery partner will collect ₹{total} on delivery.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-gray-200 p-5 md:p-6 lg:sticky lg:top-4">
            <h3 className="font-semibold text-gray-800 mb-3">Order Summary</h3>
            <ul className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {items.map((i) => (
                <li key={i.id} className="flex justify-between gap-3 text-sm">
                  <span className="text-gray-700">
                    {i.quantity} × {i.name}
                  </span>
                  <span className="text-gray-700 font-medium whitespace-nowrap">₹{i.price * i.quantity}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t border-gray-200 pt-4 space-y-2.5 text-sm">
              {billRows.map((row) => (
                <div key={row.label} className="flex justify-between">
                  <span className="text-gray-500">{row.label}</span>
                  <span className={row.free ? "text-green-700 font-semibold" : "text-gray-700 font-medium"}>{row.value}</span>
                </div>
              ))}
              {discount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Coupon discount</span>
                  <span className="font-semibold">-₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-gray-200 pt-3">
                <span className="font-semibold text-gray-800">To Pay</span>
                <span className="font-bold text-gray-800 text-lg">₹{total}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={placing}
              className="mt-5 w-full rounded-xl bg-zomato py-4 text-lg font-semibold text-white hover:bg-zomato-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {placing ? (
                <>
                  <span className="spinner-sm" /> Processing payment...
                </>
              ) : (
                <>Place Order • ₹{total}</>
              )}
            </button>
            <p className="text-center text-xs text-gray-400 mt-3">
              By placing this order you agree to Zomato's Terms of Service.
            </p>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default Checkout;
