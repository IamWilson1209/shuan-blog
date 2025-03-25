"use server"

import { auth } from "@/auth"
import { parseServerActionResponse } from "@/utils/utils";
import { client } from "@/sanity/lib/client";
import { GET_ARTICLE_BY_ID_QUERY, GET_ARTICLE_LIKES_LIKEDBY_BY_ID_QUERY, GET_ARTICLES_QUERY, GET_ARTICLES_SAVE_STATUS_BY_USER_ID, GET_AUTHOR_BY_ID_QUERY } from "@/sanity/lib/queries";
import { writeClient } from "@/sanity/lib/write-client";
import { revalidatePath } from "next/cache";
import slugify from "slugify";

/* 新增 article */
export const createArticleAction = async (
  state: any,
  form: FormData,
  content: string
) => {
  /* 查詢登入資訊 */
  const session = await auth();

  /* 如果查找不到登入資訊，返回序列化的錯誤訊息 */
  if (!session) {
    return parseServerActionResponse({
      error: "Unauthenticated",
      status: "Error"
    })
  }

  /*
    提取article資料： 
      FormData 是一種鍵值對結構
      執行Array.from()後: （［"title": "XXX"］, []...）
      filter()過濾掉content
      fromEntries: Array轉回物件
  */
  const { title, desc, category, link } = Object.fromEntries(
    Array.from(form).filter(([key]) => key !== "content"),
  );

  /* 使用slugify產生slug，生成為小寫字母 */
  const slug = slugify(title as string, { lower: true, strict: true })

  try {
    /* Object: 新article */
    const article = {
      title,
      desc,
      category,
      image: link,
      slug: {
        _type: slug,
        current: slug,
      },
      author: {
        _type: "reference",
        _ref: session?.id,
      },
      content
    }

    /* 使用writeClient創建新article */
    const res = await writeClient.create({ _type: "article", ...article })

    /* 回傳序列化成功訊息 */
    return parseServerActionResponse({
      ...res,
      error: "",
      status: "Success"
    })
  } catch (error) {
    console.log("Error Creating Article.", error);
    return parseServerActionResponse({
      error: JSON.stringify("Error creating article"),
      status: "Error"
    })
  }

}

/* 更新 article */
export const updateArticleAction = async (prevState: any, formData: FormData, content: string, articleId: string) => {
  try {
    /* 查詢登入資訊 */
    const session = await auth();

    /* 如果沒有登入，回傳Unauthenticated */
    if (!session) {
      return parseServerActionResponse({
        error: "Unauthenticated",
        status: "Error"
      })
    }

    /* 有登入，查詢要update的articleId */
    const article = await client.fetch(GET_ARTICLE_BY_ID_QUERY, { id: articleId });

    /* 如果登入資訊與作者不符，回傳Unauthenticated */
    if (session.id !== article.author._id) {
      return parseServerActionResponse({
        error: "Unauthenticated",
        status: "Error"
      })
    }

    /* 檢查登入資訊都正確，使用writeClient patch新資料給指定的article */
    const res = await writeClient.patch(articleId)
      .set({
        title: formData.get('title') as string,
        desc: formData.get('desc') as string,
        category: formData.get('category') as string,
        link: formData.get('link') as string,
        content,
      }).commit()

    /* 使顯示article頁面的路徑cache失效，在下次訪問時重新生成該頁面的內容 */
    revalidatePath(`/articles/${articleId}`);

    /* 回傳序列化成功訊息 */
    return parseServerActionResponse({
      error: "",
      status: "Success",
    })
  } catch (error) {
    console.error("Error Updating article", error);
    return parseServerActionResponse({
      error: "Error updating article",
      status: "Error"
    })
  }
}

/* 刪除 article */
export const deleteArticleAction = async (articleId: string) => {
  try {
    /* 檢查登入資訊 */
    const session = await auth();

    /* 如果沒有登入，回傳Unauthenticated */
    if (!session) {
      return parseServerActionResponse({
        error: "Unauthenticated",
        status: "Error"
      })
    }

    /* 有登入，查詢articleId */
    const article = await client.fetch(GET_ARTICLE_BY_ID_QUERY, { id: articleId });

    /* 如果登入資訊與作者不符，回傳Unauthenticated */
    if (session.id !== article.author._id) {
      return parseServerActionResponse({
        error: "Unauthenticated",
        status: "Error"
      })
    }

    /* 檢驗完畢，將刪除文章使用writeClient送出 */
    const res = await writeClient.delete(articleId)

    /* 回傳成功資訊 */
    return parseServerActionResponse({
      error: "",
      status: "Success",
    })
  } catch (error) {
    console.error("Error deleting article", error);
    return parseServerActionResponse({
      error: "Error deleting article",
      status: "Error"
    })
  }
}

/* 無限滑動一次取得10篇article*/
const MAX_LIMIT = 10
export const fetchArticlesAction = async (page: number, sanityQuery?: string | string[] | null | undefined) => {
  /* 宣告開始搜尋，結束搜尋的index */
  const start = (page - 1) * MAX_LIMIT;
  const end = page * MAX_LIMIT;

  try {
    /* 使用sanity client取得從start到end index的文章 */
    const articles = await client.withConfig({ useCdn: false }).fetch(GET_ARTICLES_QUERY, {
      start,
      end,
      sanityQuery: sanityQuery || null,
    });
    /* 回傳取得的articles */
    return articles;
  } catch (error) {
    console.error(`Server: Error fetching page ${page}:`, error);
    return parseServerActionResponse({
      error: "Error fetching articles",
      status: "Error"
    })
  }
}

/* 儲存文章 */
export const toggleSaveArticle = async (articleId: string) => {

  try {
    /* 檢查登入資訊 */
    const session = await auth();

    /* 如果沒有登入，回傳Unauthenticated */
    if (!session) {
      return parseServerActionResponse({
        error: "Unauthenticated",
        status: "Error"
      })
    }

    /* 宣告userId */
    const userId = session.id;

    /* 如果沒有傳遞articleId，直接return error */
    if (!articleId) {
      return parseServerActionResponse({
        error: "Article is required",
        status: "Error"
      })
    }

    /* 查詢要儲存的文章 */
    const articleToSave = await client.withConfig({ useCdn: false }).fetch(
      GET_ARTICLE_BY_ID_QUERY,
      { id: articleId }
    );

    /* 找不到article，回傳序列化錯誤 */
    if (!articleToSave) {
      return parseServerActionResponse({
        error: "Article not found",
        status: "Error"
      });
    }

    /* 查詢此 user 儲存文章資訊 */
    const user = await client.withConfig({ useCdn: false }).fetch(GET_ARTICLES_SAVE_STATUS_BY_USER_ID, { userId })
    const savedArticles = user.savedArticles || [];

    /* 檢查是否儲存：.some()檢查是否至少有一篇文章符合要儲存的articleId */
    const isSaved = savedArticles.some((ref: { _ref: any; }) => ref._ref === articleId);

    if (isSaved) {
      /* 如果已經儲存過，取消儲存 */
      await writeClient
        .patch(userId)
        .unset([`savedArticles[_ref == "${articleId}"]`])
        .commit();
    } else {
      /* 如果沒有儲存過，新增儲存的articleId */
      await writeClient
        .patch(userId)
        .setIfMissing({ savedArticles: [] })
        .append('savedArticles', [{ _type: 'reference', _ref: articleId }])
        .commit();
    }

    /* 根據是否儲存回傳序列化資訊 */
    return parseServerActionResponse({
      error: "",
      status: "Success",
      isSaved: !isSaved
    });
  } catch (error) {
    console.error("Error saving article", error);
    return parseServerActionResponse({
      error: "Error saving article",
      status: "Error",
    })
  }
}

/* Auth 邏輯待修改 */
export const getSavedStatus = async (userId: string, articleId: string) => {
  const user = await client.fetch(
    GET_ARTICLES_SAVE_STATUS_BY_USER_ID,
    { userId }
  );
  const savedArticles = user?.savedArticles || [];
  return savedArticles.some((ref: { _ref: string; }) => ref._ref === articleId);
}


export async function toggleLikeAction(articleId: string) {
  try {
    const session = await auth();
    if (!session || !session.id) {
      throw new Error('Unauthenticated');
    }

    const userId = session.id;
    const article = await client.withConfig({ useCdn: false }).fetch(
      GET_ARTICLE_LIKES_LIKEDBY_BY_ID_QUERY,
      { id: articleId }
    );

    if (!article) {
      throw new Error('Article not found');
    }

    const hasLiked = article.likedBy?.includes(userId);
    const newLikes = hasLiked ? article.likes - 1 : article.likes + 1;

    const newLikedBy = hasLiked
      ? article.likedBy.filter((id: string) => id !== userId)
      : [...(article.likedBy || []), userId];

    const updatedArticle = await writeClient
      .patch(articleId)
      .set({
        likes: newLikes,
        likedBy: newLikedBy.map((id: string) => ({ _type: 'reference', _ref: id })),
      })
      .commit();

    revalidatePath(`/articles/${articleId}`);
    revalidatePath(`/users/${article.author?._id}`);
    return { status: 'Success', likes: newLikes, hasLiked: !hasLiked };
  } catch (error) {
    console.error('Error toggling like:', error);
    return { status: 'Error', error: 'Failed to toggle like' };
  }
}

/* Auth 邏輯待修改 */
export const getLikedStatus = async (userId: string, articleId: string) => {
  try {
    const article = await client.withConfig({ useCdn: false }).fetch(
      GET_ARTICLE_LIKES_LIKEDBY_BY_ID_QUERY,
      { id: articleId }
    );

    if (!article) {
      throw new Error('Article not found');
    }

    const hasLiked = article.likedBy?.includes(userId);
    const likedNumber = article.likes;

    return { status: 'Success', likedNumber: likedNumber, hasLiked: hasLiked };
  } catch (error) {
    console.error('Error toggling like:', error);
    return { status: 'Error', error: 'Failed to toggle like' };
  }
}