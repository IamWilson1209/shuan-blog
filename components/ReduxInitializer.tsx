'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setSavedArticles } from '@/app/redux/save-articles/slice';
import { useSession } from 'next-auth/react';
import { client } from '@/sanity/lib/client';
import { GET_ARTICLES_SAVE_STATUS_BY_USER_ID } from '@/sanity/lib/queries';

export const ReduxInitializer = () => {
  const dispatch = useDispatch();
  const { data: session, status } = useSession();

  useEffect(() => {
    const initializeSavedArticles = async () => {
      /* 如果有登入，獲取這位使用者的初始儲存狀態 */
      if (session?.id) {
        /* 取得作者所有儲存文章的狀態 */
        const userData = await client.fetch(
          GET_ARTICLES_SAVE_STATUS_BY_USER_ID,
          {
            userId: session.id,
          }
        );

        /* 
          設置 Redux 狀態
          使用 reduce 將 savedArticleIds（e.g. ["article1", "article2"]）轉換為一個物件（Record<string, boolean>）
          { "article1": true, "article2": true }
        */
        const savedArticles =
          userData?.savedArticles?.reduce(
            (acc: Record<string, boolean>, id: string) => {
              acc[id] = true;
              return acc;
            },
            {} // 初始值
          ) || {};

        /* 將轉換後的 savedArticles 設置到 Redux store */
        dispatch(setSavedArticles(savedArticles));
      } else if (status === 'unauthenticated') {
        /* 未登入時清空狀態 */
        dispatch(setSavedArticles({}));
      }
    };

    initializeSavedArticles();
  }, [dispatch, session, status]);

  return null; // 不渲染任何 UI
};
