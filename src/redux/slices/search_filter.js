import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    search: null,
    sort: null,
    filter: null,
    page: 1,
};

export const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        // ========================================= SEARCH =========================================
        setSearchProduct: (state, action) => {
            state.search = action.payload;
            state.page = 1;
        },

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
    setSearchProduct,
    setSortProduct,
    resetSortProduct,
    setFilterProduct,
    setPageProduct,
} = filterSlice.actions;

export default filterSlice.reducer;
