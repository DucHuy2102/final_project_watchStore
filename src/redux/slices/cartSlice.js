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
        getCartUser: (state, action) => {
            const data = action.payload;
            state.tempQuantity = data.length;
            const cartItem = data.map((item) => {
                return {
                    idCart: item.id,
                    idProduct: item.product.id,
                    price: item.product.price,
                    quantity: item.quantity,
                };
            });
            state.cartItem = cartItem;
            state.cartTotalQuantity = data.reduce((total, item) => total + item.quantity, 0);
            state.cartTotalAmount = data.reduce(
                (total, item) => total + item.product.price * item.quantity,
                0
            );
        },
        addProductToCart: (state, action) => {
            const { idCart, product, quantity } = action.payload;
            const itemIndex = state.cartItem.findIndex((item) => item.idProduct === product.id);
            if (itemIndex === -1) {
                state.cartItem.push({
                    idCart: idCart,
                    idProduct: product.id,
                    price: product.price,
                    quantity: quantity,
                });
                state.tempQuantity += 1;
            } else {
                state.cartItem[itemIndex].quantity += quantity;
            }
            state.cartTotalQuantity += quantity;
            state.cartTotalAmount += product.price * quantity;
        },
        changeProductQuantity: (state, action) => {
            const { type, productId } = action.payload;
            const itemIndex = state.cartItem.findIndex((item) => item.idProduct === productId);
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
            state.tempQuantity = 0;
        },
        updateCartTotalQuantity: (state, action) => {
            state.tempQuantity = action.payload;
        },
    },
});

export const {
    getCartUser,
    addProductToCart,
    resetCart,
    changeProductQuantity,
    deleteProductFromCart,
    updateCartTotalQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;
