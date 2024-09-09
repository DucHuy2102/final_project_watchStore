import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentUser: null,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        user_SignIn: (state, action) => {
            state.currentUser = action.payload;
        },
        user_SignOut: (state) => {
            state.currentUser = null;
        },
        user_UpdateProfile: (state, action) => {
            state.currentUser = action.payload;
        },
        user_DeleteAccount: (state) => {
            state.currentUser = null;
        },
    },
});

export const { user_SignIn, user_SignOut, user_UpdateProfile, user_DeleteAccount } =
    userSlice.actions;

export default userSlice.reducer;
