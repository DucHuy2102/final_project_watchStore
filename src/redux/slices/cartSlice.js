import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    cartItem: [],
    cartTotalQuantity: 0,
    cartTotalAmount: 0,
    tempQuantity: 0,
};

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addProductToCart: (state, action) => {
            const product = action.payload;
            const itemIndex = state.cartItem.findIndex((item) => item.id === product.id);
            if (itemIndex >= 0) {
                state.cartItem[itemIndex].quantity += product.quantity;
            } else {
                state.cartItem.push(product);
            }
            state.cartTotalQuantity += product.quantity;
            state.cartTotalAmount += product.price * product.quantity;
        },
        changeProductQuantity: (state, action) => {
            const { type, productId } = action.payload;
            const itemIndex = state.cartItem.findIndex((item) => item.id === productId);
            if (type === 'increase') {
                state.cartItem[itemIndex].quantity += 1;
                state.cartTotalQuantity += 1;
                state.cartTotalAmount += state.cartItem[itemIndex].price;
            } else {
                state.cartItem[itemIndex].quantity -= 1;
                state.cartTotalQuantity -= 1;
                state.cartTotalAmount -= state.cartItem[itemIndex].price;
            }
        },
        deleteProductFromCart: (state, action) => {
            const productId = action.payload;
            const itemIndex = state.cartItem.findIndex((item) => item.id === productId);
            state.cartTotalQuantity -= state.cartItem[itemIndex].quantity;
            state.cartTotalAmount -=
                state.cartItem[itemIndex].price * state.cartItem[itemIndex].quantity;
            state.cartItem = state.cartItem.filter((item) => item.id !== productId);
        },
        resetCart: (state) => {
            state.cartItem = [];
            state.cartTotalQuantity = 0;
            state.cartTotalAmount = 0;
        },
        updateCartTotalQuantity: (state, action) => {
            state.tempQuantity = action.payload;
        },
    },
});

export const {
    addProductToCart,
    resetCart,
    changeProductQuantity,
    deleteProductFromCart,
    updateCartTotalQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;
