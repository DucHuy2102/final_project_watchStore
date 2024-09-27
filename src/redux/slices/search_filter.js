import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    sort: null,
    filter: null,
    page: 1,
};

export const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        // ========================================= SORT =========================================
        setSortProduct: (state, action) => {
            state.sort = action.payload;
        },
        resetSortProduct: (state) => {
            state.sort = null;
        },

        // ========================================= FILTER =========================================
        setFilterProduct: (state, action) => {
            state.filter = action.payload;
            state.page = 1;
        },

        // ========================================= PAGE =========================================
        setPageProduct: (state, action) => {
            state.page = action.payload;
        },
    },
});

export const {
    setSortProduct,
    resetSortProduct,
    setFilterProduct,
    setPageProduct,
} = filterSlice.actions;

export default filterSlice.reducer;
