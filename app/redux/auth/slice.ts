import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Session } from 'next-auth';

export interface AuthState {
  session: Session | null;
  status: 'authenticated' | 'unauthenticated' | 'loading';
}

const initialState: AuthState = {
  session: null,
  status: 'loading',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState: (
      state,
      action: PayloadAction<{ session: Session | null; status: AuthState['status'] }>
    ) => {
      state.session = action.payload.session;
      state.status = action.payload.status;
    },
  },
});

export const { setAuthState } = authSlice.actions;
export default authSlice.reducer;