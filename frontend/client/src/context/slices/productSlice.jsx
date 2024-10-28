import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import config from "../../config/config";

// Thunk to fetch products asynchronously
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/api/products`);
      const data = await response.json();

      if (data.success) {
        return data.data;
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [], // Ensure items is initialized as an array
    status: "idle",
    error: null,
  },
  reducers: {
    updateProduct: (state, action) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { updateProduct } = productSlice.actions;

export default productSlice.reducer;
