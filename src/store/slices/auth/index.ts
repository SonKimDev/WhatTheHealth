import {AuthState} from './types';
import {createSlice} from '@reduxjs/toolkit';

const initialState: AuthState = {
  user: null,
  gratitudes: [],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    addAuth: (state, action) => {
      state.user = {...state.user, ...action.payload};
    },
    removeAuth: state => {
      state.user = null;
    },
    addGratitudes: (state, action) => {
      state.gratitudes.push(action.payload);
    },
    loadGratitudes: (state, action) => {
      state.gratitudes = action.payload;
    },
  },
});

export const {
  addAuth,
  removeAuth,
  addGratitudes,
  loadGratitudes,
} = authSlice.actions;
export const authReducer = authSlice.reducer;
