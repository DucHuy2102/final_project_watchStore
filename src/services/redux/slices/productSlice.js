import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    likedProducts: [],
    compareProducts: [],
    isCompareOpen: false,
    allProduct: [],
};

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        // like product
        toggleLikeProduct: (state, action) => {
            const productIndex = state.likedProducts.findIndex((p) => p.id === action.payload.id);
            if (productIndex === -1) {
                state.likedProducts.push(action.payload);
            } else {
                state.likedProducts.splice(productIndex, 1);
            }
        },
        clearLikedProducts: (state) => {
            state.likedProducts = [];
        },

        // compare product
        toggleCompareProduct: (state, action) => {
            const product = action.payload;
            const existingIndex = state.compareProducts.findIndex((p) => p.id === product.id);

            if (existingIndex >= 0) {
                state.compareProducts.splice(existingIndex, 1);
            } else if (state.compareProducts.length < 2) {
                state.compareProducts.push(product);
            }
        },
        clearCompare: (state) => {
            state.compareProducts = [];
        },

        // search product
        getAllProductToSearch: (state, action) => {
            state.allProduct = action.payload;
        },
    },
});

export const { toggleLikeProduct, clearLikedProducts, toggleCompareProduct, clearCompare, getAllProductToSearch } =
    productSlice.actions;

export default productSlice.reducer;
