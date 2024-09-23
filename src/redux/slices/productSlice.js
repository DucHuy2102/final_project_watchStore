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

        // ======================== FILTER & SORT ========================
        sortProducts: (state, action) => {
            if (!state.allProducts) return;
            const option = action.payload;
            if (!state.initialProducts) {
                state.initialProducts = [...state.allProducts];
            }
            if (option === 'Giá tăng dần') {
                state.allProducts = [...state.allProducts].sort((a, b) => a.price - b.price);
            } else if (option === 'Giá giảm dần') {
                state.allProducts = [...state.allProducts].sort((a, b) => b.price - a.price);
            } else if (option === 'Từ A - Z') {
                state.allProducts = [...state.allProducts].sort((a, b) =>
                    (a.productName || '').localeCompare(b.productName || '')
                );
            } else if (option === 'Từ Z - A') {
                state.allProducts = [...state.allProducts].sort((a, b) =>
                    (b.productName || '').localeCompare(a.productName || '')
                );
            } else if (option === 'Sắp xếp') {
                state.allProducts = [...state.initialProducts];
            }
        },
    },
});

export const {
    get_All_Product,
    set_Product_Detail,
    reset_Product_Detail,
    reset_AllProduct,
    sortProducts,
} = productSlice.actions;

export default productSlice.reducer;
