

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import config from "../../config/config";

// Define a threshold for when to re-fetch all products
const REFRESH_THRESHOLD_MS = 1 * 60 * 60 * 1000; // 1 day in milliseconds

// Fetch Products Thunk
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ page, limit, category }, { getState, rejectWithValue }) => {
    try {
      const { products } = getState();

      // Check if `allProducts` is in localStorage and not expired
      const allProductsFromStorage = JSON.parse(
        localStorage.getItem("allProducts")
      );
      const lastFetched = localStorage.getItem("allProductsLastFetched");
      const now = Date.now();
      let allProductsData = null;

      // Determine if we need to re-fetch `allProducts`
      const needsRefresh =
        !allProductsFromStorage ||
        !lastFetched ||
        now - lastFetched > REFRESH_THRESHOLD_MS;

      if (needsRefresh) {
        const responseAll = await fetch(`${config.BASE_URL}/api/products/all`);
        allProductsData = await responseAll.json();
        if (!allProductsData.success)
          throw new Error("Failed to fetch all products");

        // Save to localStorage
        localStorage.setItem(
          "allProducts",
          JSON.stringify(allProductsData.data)
        );
        localStorage.setItem("allProductsLastFetched", now.toString());
      }

      const response = await fetch(
        `${config.BASE_URL}/api/products?page=${page}&limit=${limit}&category=${category}`
      );
      const data = await response.json();
      if (!data.success) throw new Error("Failed to fetch paginated products");

      return {
        products: data,
        total: data.total,
        allProducts: allProductsData
          ? allProductsData.data
          : allProductsFromStorage,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Product Slice
const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    status: "idle",
    error: null,
    total: 0,
    allProducts: JSON.parse(localStorage.getItem("allProducts")) || [],
    isAllProductsFetched: !!localStorage.getItem("allProducts"),
  },
  reducers: {
    updateProduct: (state, action) => {
      state.items = action.payload;
    },
    setSorting: (state, action) => {
      state.sortBy = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.products.data;
        state.total = action.payload.total;

        if (action.payload.allProducts) {
          state.allProducts = action.payload.allProducts;
          state.isAllProductsFetched = true;
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { updateProduct, setSorting } = productSlice.actions;

export default productSlice.reducer;

