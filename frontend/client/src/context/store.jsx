import { configureStore } from "@reduxjs/toolkit";
import CartSlice from "./slices/CartSlice";
import userSlice from "./slices/userSlice";
import productSlice from "./slices/productSlice";

const store = configureStore({
  reducer: {
    cart: CartSlice,
    products: productSlice,
    user: userSlice,
  },
});

export default store;
