import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    compareProducts: [],
    isCompareOpen: false,
};

export const compareSlice = createSlice({
    name: 'compare',
    initialState,
    reducers: {
        toggleCompareProduct: (state, action) => {
            const product = action.payload;
            const existingIndex = state.compareProducts.findIndex((p) => p.id === product.id);

            if (existingIndex >= 0) {
                state.compareProducts.splice(existingIndex, 1);
            } else if (state.compareProducts.length < 2) {
                state.compareProducts.push(product);
            }
        },
        setCompareOpen: (state, action) => {
            state.isCompareOpen = action.payload;
        },
        clearCompare: (state) => {
            state.compareProducts = [];
        },
    },
});

export const { toggleCompareProduct, setCompareOpen, clearCompare } = compareSlice.actions;

export default compareSlice.reducer;
