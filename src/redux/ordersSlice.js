import { createSlice } from "@reduxjs/toolkit";

const ORDERS_KEY = "zomato_orders_v1";

function loadOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    /* ignore */
  }
  return [];
}

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    orders: loadOrders(),
  },
  reducers: {
    placeOrder: (state, action) => {
      state.orders.unshift(action.payload);
      try {
        localStorage.setItem(ORDERS_KEY, JSON.stringify(state.orders));
      } catch (e) {
        /* ignore */
      }
    },
    updateOrderStatus: (state, action) => {
      const { id, status } = action.payload;
      const order = state.orders.find((o) => o.id === id);
      if (order) order.status = status;
      try {
        localStorage.setItem(ORDERS_KEY, JSON.stringify(state.orders));
      } catch (e) {
        /* ignore */
      }
    },
    cancelOrder: (state, action) => {
      const order = state.orders.find((o) => o.id === action.payload);
      if (order) order.status = "Cancelled";
      try {
        localStorage.setItem(ORDERS_KEY, JSON.stringify(state.orders));
      } catch (e) {
        /* ignore */
      }
    },
  },
});

export const { placeOrder, updateOrderStatus, cancelOrder } = ordersSlice.actions;

export const selectOrderById = (state, id) =>
  state.orders.orders.find((o) => o.id === id);

export default ordersSlice.reducer;
