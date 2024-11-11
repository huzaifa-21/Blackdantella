import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import config from "../../config/config";
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ page, limit, category }) => {
    try {
      const response = await fetch(
        `${config.BASE_URL}/api/products?page=${page}&limit=${limit}&category=${category}`
      );
      const data = await response.json();
      // console.log(data)
      if (data.success) {
        console.log(data)
        return { products: data, total: data.total }; 
        // return data; // return the full data here, not just the items
      } else {
        throw new Error("Failed to fetch products");
      }
    } catch (error) {
      throw new Error(error.message); // Make sure errors are thrown properly
    }
  }
);


const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    status: "idle",
    error: null,
    total:0,
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
        state.total = action.payload.total
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { updateProduct, setSorting } = productSlice.actions;

export default productSlice.reducer;


// export const { updateProduct } = productSlice.actions;

// export default productSlice.reducer;
