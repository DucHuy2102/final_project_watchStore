import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    sort: null,
    filter: null,
};

export const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        // ========================================= SORT =========================================
        sortProducts: (state, action) => {
            state.sort = action.payload;
        },
        resetSort: (state) => {
            state.sort = null;
        },

        // ========================================= FILTER =========================================
        setFilters: (state, action) => {
            state.filter = action.payload;
        },
        resetFilter: (state) => {
            state.filter = null;
        },
    },
});

export const { sortProducts, resetSort, setFilters, resetFilter } = filterSlice.actions;

export default filterSlice.reducer;
