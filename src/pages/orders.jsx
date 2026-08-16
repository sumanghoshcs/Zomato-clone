import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { cancelOrder } from "../redux/ordersSlice";
import {
  addItem,
  setRestaurant,
} from "../component/foodcard/data/cartSlice";
import { toast, Toaster } from "../components/Toast";

const STATUS_COLOR = {
  Placed: "text-blue-600 bg-blue-50",
  Preparing: "text-amber-600 bg-amber-50",
  "On the Way": "text-indigo-600 bg-indigo-50",
  Delivered: "text-green-700 bg-green-50",
  Cancelled: "text-red-600 bg-red-50",
};

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function Orders() {
  const orders = useSelector((state) => state.orders.orders);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleReorder = (order) => {
    dispatch(
      setRestaurant({
        id: order.restaurant.id,
        name: order.restaurant.name,
        image: order.restaurant.image,
        area: order.restaurant.area,
        deliveryTime: order.estimatedTime,
      })
    );
    order.items.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        dispatch(addItem(item));
      }
    });
    toast("Items added back to your cart");
    navigate("/cart");
  };

  const handleCancel = (id) => {
    dispatch(cancelOrder(id));
    toast("Order cancelled", "error");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Your Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-7xl mb-5">🛍️</div>
          <h2 className="text-xl font-semibold text-gray-800">No orders yet</h2>
          <p className="text-gray-500 mt-2">When you place an order, it will show up here.</p>
          <Link to="/" className="inline-block mt-6 rounded-lg bg-zomato px-8 py-3 text-white font-semibold hover:bg-zomato-dark">
            Order Something Delicious
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-gray-200 overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-50 px-5 py-3">
                <div>
                  <p className="font-semibold text-gray-800">{order.restaurant.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {order.id} • {formatDate(order.placedAt)}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLOR[order.status] || "bg-gray-100 text-gray-600"}`}>
                  {order.status}
                </span>
              </div>
              <div className="px-5 py-4">
                <ul className="space-y-1.5">
                  {order.items.slice(0, 3).map((i) => (
                    <li key={i.id} className="flex justify-between text-sm text-gray-600">
                      <span>{i.quantity} × {i.name}</span>
                      <span>₹{i.price * i.quantity}</span>
                    </li>
                  ))}
                  {order.items.length > 3 && (
                    <li className="text-sm text-gray-400">+ {order.items.length - 3} more items</li>
                  )}
                </ul>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3">
                  <p className="text-sm">
                    <span className="text-gray-500">Paid via {order.paymentMethod} • </span>
                    <span className="font-bold text-gray-800">₹{order.bill.total}</span>
                  </p>
                  <div className="flex gap-2">
                    {order.status === "Placed" || order.status === "Preparing" ? (
                      <button
                        onClick={() => handleCancel(order.id)}
                        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Cancel
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReorder(order)}
                        className="rounded-lg border border-zomato px-4 py-2 text-sm font-semibold text-zomato hover:bg-zomato/5 transition-colors"
                      >
                        Reorder
                      </button>
                    )}
                    <Link
                      to={`/order-success/${order.id}`}
                      className="rounded-lg bg-zomato px-4 py-2 text-sm font-semibold text-white hover:bg-zomato-dark transition-colors"
                    >
                      {order.status === "Cancelled" || order.status === "Delivered" ? "View" : "Track"}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <Toaster />
    </div>
  );
}

export default Orders;
