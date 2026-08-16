import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import userReducer from "../../../redux/userSlice";
import ordersReducer from "../../../redux/ordersSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,
    orders: ordersReducer,
  },
});

store.subscribe(() => {
  const { cart } = store.getState();
  try {
    localStorage.setItem(
      "zomato_cart_v1",
      JSON.stringify({
        restaurant: cart.restaurant,
        items: cart.items,
        coupon: cart.coupon,
      })
    );
  } catch (e) {
    /* ignore */
  }
});

export default store;
