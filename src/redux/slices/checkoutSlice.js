import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    productItems: [],
    totalPrice: 0,
    totalQuantity: 0,
    totalDiscountPrice: 0,
    totalAmountToPay: 0,
    voucher: null,
    isBuyNow: false,
};

export const checkoutSlice = createSlice({
    name: 'checkout',
    initialState,
    reducers: {
        setProductToCheckout: (state, action) => {
            const {
                productItems,
                totalPrice,
                totalQuantity,
                totalDiscountPrice,
                totalAmountToPay,
                isBuyNow,
                voucher,
            } = action.payload;
            state.productItems = productItems;
            state.totalPrice = totalPrice;
            state.totalQuantity = totalQuantity;
            state.totalDiscountPrice = totalDiscountPrice;
            state.totalAmountToPay = totalAmountToPay;
            state.isBuyNow = isBuyNow;
            state.voucher = voucher;
        },
        setResetCheckout: (state) => {
            state.productItems = [];
            state.totalPrice = 0;
            state.totalQuantity = 0;
            state.voucher = null;
            state.isBuyNow = false;
        },
    },
});

export const { setProductToCheckout, setResetCheckout } = checkoutSlice.actions;

export default checkoutSlice.reducer;
