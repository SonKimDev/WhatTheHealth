import {RootState} from '../../store';

export const selectActivity = (state: RootState) =>
  state.activityReducer.activity || null;
