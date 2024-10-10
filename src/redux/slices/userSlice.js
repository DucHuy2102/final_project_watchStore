import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    access_token: null,
    user: null,
    address: {
        province: null,
        district: null,
        ward: null,
        street: null,
        fullAddress: null,
    },
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        user_SignIn: (state, action) => {
            const { access_token, user } = action.payload;
            state.access_token = access_token;
            state.user = user;
            state.address.fullAddress = user.address;
        },
        user_SignOut: (state) => {
            state.access_token = null;
            state.user = null;
            state.address = {
                province: null,
                district: null,
                ward: null,
                street: null,
                fullAddress: null,
            };
        },
        user_UpdateProfile: (state, action) => {
            const { user, address } = action.payload;
            state.user = user;
            state.address.province = address.province;
            state.address.district = address.district;
            state.address.ward = address.ward;
            state.address.street = address.street;
            state.address.fullAddress = address.fullAddress;
        },
        update_Address: (state, action) => {
            const { province, district, ward, street, fullAddress } = action.payload;
            state.address.province = province;
            state.address.district = district;
            state.address.ward = ward;
            state.address.street = street;
            state.address.fullAddress = fullAddress;
        },
    },
});

export const { user_SignIn, user_SignOut, user_UpdateProfile, update_Address } = userSlice.actions;

export default userSlice.reducer;
