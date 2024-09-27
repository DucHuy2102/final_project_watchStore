import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    allProducts: null,
    productDetail: null,
    initialProducts: null,
};

export const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        // ======================== All Product ========================
        get_All_Product: (state, action) => {
            state.allProducts = action.payload;
        },
        reset_AllProduct: (state) => {
            state.allProducts = null;
        },

        // ======================== Product Detail ========================
        set_Product_Detail: (state, action) => {
            state.productDetail = action.payload;
        },
        reset_Product_Detail: (state) => {
            state.productDetail = null;
        },
    },
});

export const { get_All_Product, set_Product_Detail, reset_Product_Detail, reset_AllProduct } =
    productSlice.actions;

export default productSlice.reducer;
