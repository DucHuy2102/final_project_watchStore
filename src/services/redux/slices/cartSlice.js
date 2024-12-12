import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    cartItem: [],
    cartTotalQuantity: 0,
};

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        getCartUser: (state, action) => {
            const cartData = action.payload;
            state.cartItem = cartData.map((item) => {
                return {
                    idCart: item.id,
                    productItem: item.product,
                    quantity: item.quantity,
                    option: item.option,
                };
            });
            state.cartTotalQuantity = cartData.reduce((total, item) => total + item.quantity, 0);
        },
        addProductToCart: (state, action) => {
            const { idCart, productItem, quantity, option } = action.payload;
            const itemIndex = state.cartItem.findIndex(
                (item) => item.productItem.id === productItem.id && item.option === option,
            );
            if (itemIndex === -1) {
                state.cartItem.push({
                    idCart: idCart,
                    productItem: productItem,
                    quantity: quantity,
                    option: option,
                });
            } else {
                state.cartItem[itemIndex].quantity += quantity;
            }
            state.cartTotalQuantity += quantity;
        },
        changeColorProduct: (state, action) => {
            const { idCart, option } = action.payload;
            const itemIndex = state.cartItem.findIndex((item) => item.idCart === idCart);
            if (itemIndex === -1) {
                return;
            } else {
                state.cartItem[itemIndex].option = option;
            }
        },
        changeProductQuantity: (state, action) => {
            const { type, idCart, quantity = 1 } = action.payload;
            const itemIndex = state.cartItem.findIndex((item) => item.idCart === idCart);
            if (itemIndex === -1) return;
            const cartItem = state.cartItem[itemIndex];
            if (type === 'increase') {
                cartItem.quantity += quantity;
                state.cartTotalQuantity += quantity;
            } else if (type === 'decrease') {
                if (cartItem.quantity > 1) {
                    cartItem.quantity -= 1;
                    state.cartTotalQuantity -= 1;
                } else {
                    state.cartTotalQuantity -= 1;
                    state.cartItem.splice(itemIndex, 1);
                }
            }
        },
        deleteProductFromCart: (state, action) => {
            const idCart = action.payload;
            if (!idCart) return;
            const itemIndex = state.cartItem.findIndex((item) => item.idCart === idCart);
            if (itemIndex === -1) {
                return;
            } else {
                state.cartTotalQuantity -= state.cartItem[itemIndex]?.quantity;
                state.cartItem.splice(itemIndex, 1);
            }
        },
        resetCart: (state) => {
            state.cartItem = [];
            state.cartTotalQuantity = 0;
        },
    },
});

export const {
    getCartUser,
    addProductToCart,
    resetCart,
    changeColorProduct,
    changeProductQuantity,
    deleteProductFromCart,
} = cartSlice.actions;

export default cartSlice.reducer;
