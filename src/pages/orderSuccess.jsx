import React, { Suspense, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectOrderById,
  updateOrderStatus,
} from "../redux/ordersSlice";
import { getRestaurantById } from "../data/restaurants";
import { Toaster } from "../components/Toast";

const TrackingMap = React.lazy(() => import("../components/TrackingMap"));

const STEPS = ["Placed", "Preparing", "On the Way", "Delivered"];

const TIMING = {
  preparing: 12,
  onTheWay: 26,
  arrive: 105,
  delivered: 118,
};

const KOLKATA = { lat: 22.5726, lng: 88.3639 };

function seedNum(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return (h % 1000) / 1000;
}

function restaurantCoords(order) {
  const r = getRestaurantById(order.restaurant?.id);
  if (r && r.lat != null && r.lng != null) {
    return { lat: r.lat, lng: r.lng };
  }
  const s = seedNum(order.id || "restaurant");
  return {
    lat: KOLKATA.lat + (s - 0.5) * 0.05,
    lng: KOLKATA.lng + (s - 0.5) * 0.05,
  };
}

function fallbackHome(from, order) {
  const s = seedNum((order.id || "home") + "home");
  const dist = 0.012 + s * 0.02;
  const ang = s * Math.PI * 2;
  return {
    lat: from.lat + dist * Math.cos(ang),
    lng: from.lng + dist * Math.sin(ang),
  };
}

async function geocodeAddress(order) {
  const a = order.address;
  if (!a || !a.flat || !a.street || !a.pincode) return null;
  const q = `${a.flat}, ${a.street}, ${a.city || "Kolkata"}, ${a.pincode}, India`;
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`
    );
    const arr = await res.json();
    if (arr && arr[0]) {
      return { lat: parseFloat(arr[0].lat), lng: parseFloat(arr[0].lon) };
    }
  } catch (e) {
    /* ignore */
  }
  return null;
}

async function fetchRoute(from, to) {
  const res = await fetch(
    `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`
  );
  if (!res.ok) throw new Error("route failed");
  const json = await res.json();
  const coords = json?.routes?.[0]?.geometry?.coordinates;
  if (!coords || coords.length < 2) throw new Error("no route");
  return coords.map(([lng, lat]) => [lat, lng]);
}

function cumulativeDists(route) {
  const dists = [0];
  for (let i = 1; i < route.length; i++) {
    const a = route[i - 1];
    const b = route[i];
    dists.push(dists[i - 1] + Math.sqrt((b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2));
  }
  return dists;
}

function pointAt(route, dists, total, t) {
  if (!route.length) return { lat: 0, lng: 0 };
  if (total <= 0) return { lat: route[0][0], lng: route[0][1] };
  const target = total * t;
  let i = 0;
  while (i < dists.length - 2 && dists[i + 1] < target) i++;
  const segLen = (dists[i + 1] || 0) - dists[i];
  const f = Math.min(Math.max((target - dists[i]) / (segLen || 1), 0), 1);
  const a = route[i];
  const b = route[i + 1];
  return {
    lat: a[0] + (b[0] - a[0]) * f,
    lng: a[1] + (b[1] - a[1]) * f,
  };
}

export function OrderSuccess() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const order = useSelector((state) => selectOrderById(state, id));
  const [mapData, setMapData] = useState(null);
  const [driver, setDriver] = useState(null);
  const [arrived, setArrived] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!order) return;
    let cancelled = false;
    (async () => {
      const from = restaurantCoords(order);
      const to = (await geocodeAddress(order)) || fallbackHome(from, order);
      let route = [[from.lat, from.lng], [to.lat, to.lng]];
      try {
        route = await fetchRoute(from, to);
      } catch (e) {
        /* keep straight line */
      }
      if (!cancelled) setMapData({ from, to, route });
    })();
    return () => {
      cancelled = true;
    };
  }, [order]);

  useEffect(() => {
    if (!order || order.status === "Cancelled") return;
    const stepIndex = STEPS.indexOf(order.status);
    const timers = [];
    const schedule = (sec, status) => {
      if (sec > 0) {
        timers.push(setTimeout(() => dispatch(updateOrderStatus({ id, status })), sec * 1000));
      }
    };
    if (stepIndex < 1) schedule(TIMING.preparing, "Preparing");
    if (stepIndex < 2) schedule(TIMING.onTheWay, "On the Way");
    if (stepIndex < 3) schedule(TIMING.delivered, "Delivered");
    return () => timers.forEach(clearTimeout);
  }, [order, id, dispatch]);

  useEffect(() => {
    if (!mapData || order.status !== "On the Way") {
      if (mapData && order.status === "Delivered") {
        setDriver({ lat: mapData.to.lat, lng: mapData.to.lng });
        setArrived(true);
      }
      return;
    }
    const { route } = mapData;
    const dists = cumulativeDists(route);
    const total = dists[dists.length - 1];
    const travelMs = (TIMING.arrive - TIMING.onTheWay) * 1000;
    const interval = 120;
    let elapsed = 0;
    const tick = setInterval(() => {
      elapsed += interval;
      const t = Math.min(elapsed / travelMs, 1);
      const pos = pointAt(route, dists, total, t);
      pos.lat += (Math.random() - 0.5) * 0.00006;
      pos.lng += (Math.random() - 0.5) * 0.00006;
      setDriver(pos);
      setProgress(t);
      if (t >= 1) {
        clearInterval(tick);
        setDriver({ lat: route[route.length - 1][0], lng: route[route.length - 1][1] });
        setProgress(1);
        setArrived(true);
      }
    }, interval);
    return () => clearInterval(tick);
  }, [order.status, mapData]);

  if (!order) {
    return (
      <div className="text-center py-24 px-4">
        <div className="text-7xl mb-4">🍔</div>
        <h2 className="text-2xl font-semibold text-gray-800">Order not found</h2>
        <Link to="/" className="inline-block mt-6 rounded-lg bg-zomato px-8 py-3 text-white font-semibold">
          Go to Homepage
        </Link>
        <Toaster />
      </div>
    );
  }

  const currentStep = order.status === "Cancelled" ? -1 : STEPS.indexOf(order.status);
  const remainingMin =
    order.status === "On the Way" && !arrived
      ? Math.max(1, Math.ceil((1 - progress) * (TIMING.arrive - TIMING.onTheWay) / 60))
      : 0;

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-10 text-center">
      <div className="animate-pop-in">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <svg viewBox="0 0 24 24" className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mt-5">Order Placed Successfully!</h1>
        <p className="text-gray-500 mt-2">
          Order ID: <span className="font-semibold text-gray-700">{order.id}</span>
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-gray-200 p-5 text-left">
        <div className="flex items-center gap-4">
          <img src={order.restaurant.image} alt={order.restaurant.name} className="h-16 w-16 rounded-xl object-cover" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-800 truncate">{order.restaurant.name}</p>
            <p className="text-sm text-gray-500">{order.restaurant.area}</p>
            <p className="text-sm text-green-700 font-semibold mt-0.5">
              Estimated delivery: {order.estimatedTime}
            </p>
          </div>
        </div>
      </div>

      {order.status === "Cancelled" ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="text-red-700 font-semibold">This order was cancelled.</p>
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-gray-200 p-5 md:p-6">
          <h3 className="font-semibold text-gray-800 mb-6">Live Order Tracking</h3>
          <div className="flex items-center">
            {STEPS.map((step, i) => (
              <React.Fragment key={step}>
                {i > 0 && (
                  <div className={`flex-1 h-1.5 rounded-full mx-1 ${i <= currentStep ? "bg-green-600" : "bg-gray-200"}`} />
                )}
                <div className="flex flex-col items-center">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                      i <= currentStep ? "bg-green-600 border-green-600 text-white" : "border-gray-300 text-gray-400 bg-white"
                    }`}
                  >
                    {i <= currentStep ? "✓" : i + 1}
                  </div>
                  <p className={`text-[11px] mt-1.5 ${i <= currentStep ? "text-green-700 font-semibold" : "text-gray-400"}`}>
                    {step}
                  </p>
                </div>
              </React.Fragment>
            ))}
          </div>
          {currentStep === STEPS.length - 1 && (
            <p className="mt-5 text-green-700 font-semibold animate-pop-in">🍽️ Your order has been delivered. Enjoy your meal!</p>
          )}
        </div>
      )}

      {order.status !== "Cancelled" && (
        <div className="mt-6 text-left">
          <Suspense
            fallback={
              <div className="h-80 rounded-2xl bg-[#1c1c20] border border-gray-700 flex items-center justify-center">
                <p className="text-sm text-gray-500">Loading live map…</p>
              </div>
            }
          >
            <TrackingMap
              from={mapData?.from}
              to={mapData?.to}
              driver={driver}
              arrived={arrived}
              delivered={order.status === "Delivered"}
              route={mapData?.route}
              height="h-72 md:h-80"
            />
          </Suspense>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
              <span className="flex items-center gap-1.5"><span className="text-base">🍽️</span> Restaurant</span>
              <span className="flex items-center gap-1.5"><span className="text-base">🏠</span> Your location</span>
              <span className="flex items-center gap-1.5"><span className="text-base">🛵</span> Delivery partner</span>
            </div>
            {order.status === "On the Way" && !arrived && (
              <span className="text-sm font-semibold text-zomato">Arriving in ~{remainingMin} min</span>
            )}
          </div>

          {order.status === "Preparing" && (
            <p className="mt-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
              ⏳ Your order is being prepared by {order.restaurant.name}.
            </p>
          )}

          {arrived && order.status !== "Delivered" && (
            <div className="mt-4 rounded-xl border border-zomato/40 bg-zomato/10 px-4 py-4 animate-pop-in">
              <p className="font-semibold text-zomato">🛵 Delivery partner has reached your location</p>
              <p className="text-sm text-gray-600 mt-1">
                Please keep your phone ready and get ready for the call.
              </p>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-gray-200 p-5 text-left">
        <h3 className="font-semibold text-gray-800 mb-3">Order Details</h3>
        <ul className="divide-y divide-gray-100">
          {order.items.map((i) => (
            <li key={i.id} className="flex justify-between py-2.5 text-sm">
              <span className="text-gray-700">{i.quantity} × {i.name}</span>
              <span className="text-gray-700 font-medium">₹{i.price * i.quantity}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 space-y-1.5 border-t border-gray-200 pt-3 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">Item total</span><span className="text-gray-700">₹{order.bill.itemTotal}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Delivery fee</span><span className="text-gray-700">{order.bill.deliveryFee === 0 ? "FREE" : `₹${order.bill.deliveryFee}`}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">GST & charges</span><span className="text-gray-700">₹{order.bill.gst}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Platform fee</span><span className="text-gray-700">₹{order.bill.platformFee}</span></div>
          {order.bill.discount > 0 && (
            <div className="flex justify-between text-green-700"><span>Coupon discount</span><span className="font-semibold">-₹{order.bill.discount}</span></div>
          )}
          <div className="flex justify-between pt-1"><span className="font-semibold text-gray-800">Total paid</span><span className="font-bold text-gray-800">₹{order.bill.total}</span></div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-gray-200 p-5 text-left">
        <h3 className="font-semibold text-gray-800 mb-3">Delivery Details</h3>
        <p className="text-sm text-gray-700"><span className="text-gray-500">Deliver to: </span>{order.address.name} ({order.address.type})</p>
        <p className="text-sm text-gray-700 mt-1">{order.address.flat}, {order.address.street}, {order.address.city} - {order.address.pincode}</p>
        <p className="text-sm text-gray-700 mt-1"><span className="text-gray-500">Phone: </span>{order.address.phone}</p>
        <p className="text-sm text-gray-700 mt-1"><span className="text-gray-500">Payment: </span>{order.paymentMethod}</p>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
        <Link to="/orders" className="rounded-xl border-2 border-zomato px-8 py-3 text-zomato font-semibold hover:bg-zomato/5 transition-colors">
          View All Orders
        </Link>
        <Link to="/" className="rounded-xl bg-zomato px-8 py-3 text-white font-semibold hover:bg-zomato-dark transition-colors">
          Order More Food
        </Link>
      </div>
      <Toaster />
    </div>
  );
}

export default OrderSuccess;
