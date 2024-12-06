import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    likedProducts: [],
};

const likeProductSlice = createSlice({
    name: 'likeProduct',
    initialState,
    reducers: {
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
    },
});

export const { toggleLikeProduct, clearLikedProducts } = likeProductSlice.actions;

export default likeProductSlice.reducer;
