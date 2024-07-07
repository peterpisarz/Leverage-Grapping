import { configureStore } from '@reduxjs/toolkit';
import accountReducer from './slices/accountSlice';
import contractReducer from './slices/contractSlice';

const store = configureStore({
  reducer: {
    account: accountReducer,
    contract: contractReducer,
  },
});

export default store;
