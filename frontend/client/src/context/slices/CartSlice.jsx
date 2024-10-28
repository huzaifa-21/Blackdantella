import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

// Async thunk to fetch cart items from the database
export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async () => {
    const response = await axiosInstance.get(`/api/cart/`); // Update with your actual API endpoint
    return response.data.data; // Assuming response.data contains the cart items
  }
);

const initialState = {
  items: [],
  status: "idle",
  error: null,
};

const CartSlice = createSlice({
  name: "cartslice",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const theProduct = state.items.find(
        (product) =>
          product.id === action.payload.id &&
          product.color === action.payload.color &&
          product.size === action.payload.size
      );
      if (theProduct) {
        state.items[state.items.indexOf(theProduct)] = {
          ...theProduct,
          quantity: theProduct.quantity + action.payload.quantity,
        };
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromCart: (state, action) => {
      const toDelete = state.items.findIndex(
        (item) =>
          item.id === action.payload.id &&
          item.color === action.payload.color &&
          item.size === action.payload.size
      );
      if (toDelete !== -1) {
        state.items.splice(toDelete, 1);
      }
    },
    clearCart: (state) => {
      state.items.length = 0; // Clear the cart
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload; // Assign fetched items to state
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addToCart, removeFromCart, clearCart } = CartSlice.actions;

export default CartSlice.reducer;

// Selector to get the cart length
export const selectCartLength = (state) => state.cart.items.length;
