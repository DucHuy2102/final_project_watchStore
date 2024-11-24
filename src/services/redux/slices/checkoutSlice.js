import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isBuyNow: false,

    cartItems: {
        productItems: [],
        totalQuantity: 0,
    },

    buyNowItem: {
        productItems: null,
        totalQuantity: 0,
    },

    orderDetail: null,
};

export const checkoutSlice = createSlice({
    name: 'checkout',
    initialState,
    reducers: {
        setProductToCheckout: (state, action) => {
            const { productItems, totalQuantity, isBuyNow } = action.payload;
            if (isBuyNow) {
                state.buyNowItem = {
                    productItems,
                    totalQuantity,
                };
            } else {
                state.cartItems = {
                    productItems,
                    totalQuantity,
                };
            }
            state.isBuyNow = isBuyNow;
        },
        resetCheckout: (state) => {
            state.cartItems = {
                productItems: [],
                totalQuantity: 0,
            };
            state.buyNowItem = {
                pproductItems: null,
                totalQuantity: 0,
            };
            state.isBuyNow = false;
        },

        setOrderDetail: (state, action) => {
            state.orderDetail = action.payload;
        },

        resetOrderDetail: (state) => {
            state.orderDetail = null;
        },
    },
});

export const { setProductToCheckout, resetCheckout, setOrderDetail, resetOrderDetail } = checkoutSlice.actions;

export default checkoutSlice.reducer;
