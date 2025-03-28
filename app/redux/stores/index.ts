import { configureStore } from '@reduxjs/toolkit';
import savedArticlesReducer from '../save-articles/slice';
import likedArticlesReducer from '../like-articles/slice';
import authReducer from '../auth/slice';

export const store = configureStore({
  reducer: {
    savedArticles: savedArticlesReducer,
    likedArticles: likedArticlesReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;