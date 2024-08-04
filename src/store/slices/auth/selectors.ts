import {RootState} from '../../store';

export const selectUser = (state: RootState) => state.authReducer.user || null;
export const selectGratitude = (state: RootState) =>
  state.authReducer.gratitudes || '';
