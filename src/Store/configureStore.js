import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../Store/createSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});
