import {configureStore} from '@reduxjs/toolkit';
import {authReducer} from './slices/auth';
import {activityReducer} from './slices/activity';

const store = configureStore({
  reducer: {
    authReducer,
    activityReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export default store;
