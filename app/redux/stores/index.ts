import { configureStore } from '@reduxjs/toolkit';
import savedArticlesReducer from '../save-articles/slice';

export const store = configureStore({
  reducer: {
    savedArticles: savedArticlesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;