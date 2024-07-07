// src/slices/contractSlice.js
import { createSlice } from '@reduxjs/toolkit';

const contractSlice = createSlice({
  name: 'contract',
  initialState: {
    contract: null,
  },
  reducers: {
    setContract(state, action) {
      state.contract = action.payload;
    },
  },
});

export const { setContract } = contractSlice.actions;

export default contractSlice.reducer;
