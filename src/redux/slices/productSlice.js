import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    productDetail: null,
};

export const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        // ======================== Product Detail ========================
        set_Product_Detail: (state, action) => {
            state.productDetail = action.payload;
        },
        reset_Product_Detail: (state) => {
            state.productDetail = null;
        },
    },
});

export const { set_Product_Detail, reset_Product_Detail } = productSlice.actions;

export default productSlice.reducer;
