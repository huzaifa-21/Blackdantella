import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import config from "../../config/config";

// Define a threshold for when to re-fetch all products

// Fetch Products Thunk
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ page, limit, category }, { getState, rejectWithValue }) => {
    try {
      // const responseAll = await fetch(`${config.BASE_URL}/api/products/all`);
      // const allProductsData = await responseAll.json();
      const response = await fetch(
        `${config.BASE_URL}/api/products?page=${page}&limit=${limit}&category=${category}`
      );
      const data = await response.json();
      if (!data.success) throw new Error("Failed to fetch paginated products");

      return {
        products: data,
        total: data.total,
        // allProducts: allProductsData,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const fetchAllProducts = createAsyncThunk(
  "products/fetchAllProducts",
  async () => {
    try {
      const responseAll = await fetch(`${config.BASE_URL}/api/products/all`);
      const allProductsData = await responseAll.json();
      return {
        allProducts: allProductsData,
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
    allProducts: [],
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
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchAllProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allProducts = action.payload.allProducts.data;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { updateProduct, setSorting } = productSlice.actions;

export default productSlice.reducer;
