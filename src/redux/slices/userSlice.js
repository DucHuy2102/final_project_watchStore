import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    access_token: null,
    user: null,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        user_SignIn: (state, action) => {
            const { access_token, user } = action.payload;
            state.access_token = access_token;
            state.user = user;
        },
        user_SignOut: (state) => {
            state.access_token = null;
            state.user = null;
        },
        user_UpdateProfile: (state, action) => {
            const { user } = action.payload;
            state.user = user;
        },
    },
});

export const { user_SignIn, user_SignOut, user_UpdateProfile } = userSlice.actions;

export default userSlice.reducer;
