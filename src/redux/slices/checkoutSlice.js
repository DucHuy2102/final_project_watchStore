import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    productItems: [],
    totalPrice: 0,
    totalQuantity: 0,
    shipping: 0,
    voucher: null,
    isBuyNow: false,
};

export const checkoutSlice = createSlice({
    name: 'checkout',
    initialState,
    reducers: {
        setProductToCheckout: (state, action) => {
            const { productItems, totalPrice, totalQuantity, shipping, voucher, isBuyNow } =
                action.payload;
            state.productItems = productItems;
            state.totalPrice = totalPrice;
            state.totalQuantity = totalQuantity;
            state.shipping = shipping;
            state.isBuyNow = isBuyNow;
            state.voucher = voucher;
        },
        setResetCheckout: (state) => {
            state.productItems = [];
            state.totalPrice = 0;
            state.totalQuantity = 0;
            state.shipping = 0;
            state.voucher = null;
            state.isBuyNow = false;
        },
    },
});

export const { setProductToCheckout, setResetCheckout } = checkoutSlice.actions;

export default checkoutSlice.reducer;
