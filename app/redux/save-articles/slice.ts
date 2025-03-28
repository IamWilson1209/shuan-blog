import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SavedArticlesState {
  savedArticles: Record<string, boolean>;
}

const initialState: SavedArticlesState = {
  savedArticles: {},
};

const savedArticlesSlice = createSlice({
  name: 'savedArticles',
  initialState,
  reducers: {
    /* 切換單篇文章的儲存狀態 */
    handleSaveArticle: (state, action: PayloadAction<{ articleId: string; isSaved: boolean }>) => {
      state.savedArticles[action.payload.articleId] = action.payload.isSaved;
    },
    /* 初始化所有儲存文章（從server） */
    setSavedArticles: (state, action: PayloadAction<Record<string, boolean>>) => {
      state.savedArticles = action.payload;
    },
  },
});

export const { handleSaveArticle, setSavedArticles } = savedArticlesSlice.actions;
export default savedArticlesSlice.reducer;