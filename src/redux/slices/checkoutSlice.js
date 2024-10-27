import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isBuyNow: false,

    cartItems: {
        productItems: [],
        totalPrice: 0,
        totalQuantity: 0,
        totalDiscountPrice: 0,
        totalAmountToPay: 0,
    },

    buyNowItem: {
        productItems: null,
        totalPrice: 0,
        totalQuantity: 0,
        totalDiscountPrice: 0,
        totalAmountToPay: 0,
    },

    orderDetail: null,
};

export const checkoutSlice = createSlice({
    name: 'checkout',
    initialState,
    reducers: {
        setProductToCheckout: (state, action) => {
            const { productItems, totalPrice, totalQuantity, totalDiscountPrice, totalAmountToPay, isBuyNow } =
                action.payload;
            if (isBuyNow) {
                state.buyNowItem = {
                    productItems,
                    totalPrice,
                    totalQuantity,
                    totalDiscountPrice,
                    totalAmountToPay,
                };
            } else {
                state.cartItems = {
                    productItems,
                    totalPrice,
                    totalQuantity,
                    totalDiscountPrice,
                    totalAmountToPay,
                };
            }
            state.isBuyNow = isBuyNow;
        },
        resetCheckout: (state) => {
            state.cartItems = {
                productItems: [],
                totalPrice: 0,
                totalQuantity: 0,
                totalDiscountPrice: 0,
                totalAmountToPay: 0,
            };
            state.buyNowItem = {
                pproductItems: null,
                totalPrice: 0,
                totalQuantity: 0,
                totalDiscountPrice: 0,
                totalAmountToPay: 0,
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
