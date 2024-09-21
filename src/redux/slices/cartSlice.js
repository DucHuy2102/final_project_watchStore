import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    cartItem: [],
    cartTotalQuantity: 0,
    cartTotalAmount: 0,
};

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        getCartUser: (state, action) => {
            const data = action.payload;
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
                if (state.cartItem[itemIndex].quantity > 0) {
                    state.cartItem[itemIndex].quantity -= 1;
                    state.cartTotalQuantity -= 1;
                    state.cartTotalAmount -= state.cartItem[itemIndex].price;
                } else {
                    state.cartTotalQuantity -= 1;
                    state.cartTotalAmount -= state.cartItem[itemIndex].price;
                    state.cartItem.splice(itemIndex, 1);
                }
            }
        },
        deleteProductFromCart: (state, action) => {
            const idProduct_Dispatch = action.payload;
            const itemIndex = state.cartItem.findIndex(
                (item) => item.idProduct === idProduct_Dispatch
            );
            if (itemIndex !== -1) {
                state.cartTotalQuantity -= state.cartItem[itemIndex].quantity;
                state.cartTotalAmount -=
                    state.cartItem[itemIndex].price * state.cartItem[itemIndex].quantity;
                state.cartItem.splice(itemIndex, 1);
            }
        },
        resetCart: (state) => {
            state.cartItem = [];
            state.cartTotalQuantity = 0;
            state.cartTotalAmount = 0;
        },
    },
});

export const {
    getCartUser,
    addProductToCart,
    resetCart,
    changeProductQuantity,
    deleteProductFromCart,
} = cartSlice.actions;

export default cartSlice.reducer;
