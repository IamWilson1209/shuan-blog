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
    setLikedArticles: (state, action: PayloadAction<string[]>) => {
      /* 將 string[] 轉換為 Record<string, boolean> */
      state.likedArticles = action.payload.reduce(
        /* Record<K, T> 表示一個物件，鍵的類型是 K，值的類型是 T */
        (acc: Record<string, boolean>, id: string) => {
          acc[id] = true;
          return acc;
        },
        {} // 初始值
      );
    },
    /* 更新單篇文章的按讚狀態 */
    updateLikeStatus: (
      state,
      action: PayloadAction<{ articleId: string; hasLiked: boolean }>
    ) => {
      state.likedArticles[action.payload.articleId] = action.payload.hasLiked;
    },
    // 新增清空 action
    clearLikedArticles: (state) => {
      state.likedArticles = {};
    },
  },
});

export const { setLikedArticles, updateLikeStatus, clearLikedArticles } = likedArticlesSlice.actions;
export default likedArticlesSlice.reducer;