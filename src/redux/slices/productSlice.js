import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    product: null,
};

export const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        get_All_Product: (state, action) => {
            state.product = action.payload;
        },
        set_Product_Null: (state) => {
            state.product = null;
        },
        // user_UpdateProfile: (state, action) => {
        //     state.product = action.payload;
        // },
    },
});

export const { get_All_Product, set_Product_Null } = productSlice.actions;

export default productSlice.reducer;
