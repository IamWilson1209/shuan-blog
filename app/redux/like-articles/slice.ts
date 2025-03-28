import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LikedArticlesState {
  likedArticles: Record<string, boolean>;
}

const initialState: LikedArticlesState = {
  likedArticles: {},
}

const likedArticlesSlice = createSlice({
  name: 'likedArticles',
  initialState,
  reducers: {
    /*  初始化所有按讚文章 */
    setLikedArticles: (state, action: PayloadAction<string[]>) => {
      action.payload.forEach((articleId) => {
        state.likedArticles[articleId] = true;
      });
    },
    /* 更新單篇文章的按讚狀態 */
    updateLikeStatus: (
      state,
      action: PayloadAction<{ articleId: string; hasLiked: boolean }>
    ) => {
      state.likedArticles[action.payload.articleId] = action.payload.hasLiked;
    },
  },
});

export const { setLikedArticles, updateLikeStatus } = likedArticlesSlice.actions;
export default likedArticlesSlice.reducer;