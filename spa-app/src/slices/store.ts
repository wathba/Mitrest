import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./Cart-slice";
import accountReducer from "./account-slice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    account:accountReducer,
  },
});