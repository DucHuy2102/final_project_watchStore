import { combineReducers, configureStore } from '@reduxjs/toolkit';
import themeReducer from './slices/theme.slice';
import userSlice from './slices/userSlice';
import productSlice from './slices/productSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

const rootReducer = combineReducers({
    theme: themeReducer,
    user: userSlice,
    product: productSlice,
});

const persistConfig = {
    key: 'root',
    storage,
    version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);
