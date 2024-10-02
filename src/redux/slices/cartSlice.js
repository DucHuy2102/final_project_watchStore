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
            const cartData = action.payload;
            state.cartItem = cartData.map((item) => {
                return {
                    idCart: item.id,
                    idProduct: item.product.id,
                    productItem: item.product,
                    quantity: item.quantity,
                    discoutPrice: item.product.discount,
                };
            });
            state.cartTotalQuantity = cartData.reduce((total, item) => total + item.quantity, 0);
            state.cartTotalAmount = cartData.reduce((total, item) => {
                const price = item.product.price || 0;
                return total + price * item.quantity;
            }, 0);
        },
        addProductToCart: (state, action) => {
            const { idCart, idProduct, productItem, quantity, discoutPrice } = action.payload;
            const itemIndex = state.cartItem.findIndex((item) => item.idProduct === idProduct);
            if (itemIndex === -1) {
                state.cartItem.push({
                    idCart: idCart,
                    idProduct: idProduct,
                    productItem: productItem,
                    quantity: quantity,
                    discoutPrice: discoutPrice,
                });
            } else {
                state.cartItem[itemIndex].quantity += quantity;
            }
            state.cartTotalQuantity += quantity;
            state.cartTotalAmount += productItem.price * quantity;
        },
        changeProductQuantity: (state, action) => {
            const { type, productId } = action.payload;
            const itemIndex = state.cartItem.findIndex((item) => item.idProduct === productId);
            if (itemIndex === -1) return;
            const cartItem = state.cartItem[itemIndex];
            if (type === 'increase') {
                cartItem.quantity += 1;
                state.cartTotalQuantity += 1;
                state.cartTotalAmount += cartItem.productItem.price;
            } else if (type === 'decrease') {
                if (cartItem.quantity > 1) {
                    cartItem.quantity -= 1;
                    state.cartTotalQuantity -= 1;
                    state.cartTotalAmount -= cartItem.productItem.price;
                } else {
                    state.cartTotalQuantity -= 1;
                    state.cartTotalAmount -= cartItem.productItem.price;
                    state.cartItem.splice(itemIndex, 1);
                }
            }
        },
        deleteProductFromCart: (state, action) => {
            const idProduct = action.payload;
            const itemIndex = state.cartItem.findIndex((item) => item.idProduct === idProduct);
            if (itemIndex === -1) return;
            if (itemIndex !== -1) {
                state.cartTotalQuantity -= state.cartItem[itemIndex].quantity;
                state.cartTotalAmount -=
                    state.cartItem[itemIndex].productItem.price *
                    state.cartItem[itemIndex].quantity;
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
