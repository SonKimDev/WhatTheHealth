import {createSlice} from '@reduxjs/toolkit';
import {ActivityState} from './types';

const initialState: ActivityState = {
  activity: {
    steps: 0,
    distance: 0,
    meditation: 0,
    yoga: 0,
  },
};

const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    addActivity: (state, action) => {
      state.activity = {...state.activity, ...action.payload};
    },
    removeActivity: state => {
      state.activity = initialState.activity;
    },
  },
});

export const {addActivity, removeActivity} = activitySlice.actions;
export const activityReducer = activitySlice.reducer;
