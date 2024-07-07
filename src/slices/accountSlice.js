// src/slices/accountSlice.js
import { createSlice } from '@reduxjs/toolkit';

const accountSlice = createSlice({
  name: 'account',
  initialState: {
    account: null,
    provider: null,
  },
  reducers: {
    setAccount(state, action) {
      state.account = action.payload;
    },
    setProvider(state, action) {
      state.provider = action.payload;
    },
  },
});

export const { setAccount, setProvider } = accountSlice.actions;

export default accountSlice.reducer;
