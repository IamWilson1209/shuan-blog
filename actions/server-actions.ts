"use server"

import { auth } from "@/auth"
import { parseServerActionResponse } from "@/utils/utils";
import { client } from "@/sanity/lib/client";
import { GET_ARTICLE_BY_ID_QUERY, GET_ARTICLE_LIKES_LIKEDBY_BY_ID_QUERY, GET_ARTICLES_QUERY, GET_ARTICLES_SAVE_STATUS_BY_USER_ID } from "@/sanity/lib/queries";
import { writeClient } from "@/sanity/lib/write-client";
import { revalidatePath } from "next/cache";
import slugify from "slugify";

export const createArticleAction = async (
  state: any,
  form: FormData,
  content: string
) => {
  const session = await auth();

  if (!session) {
    return parseServerActionResponse({
      error: "Unauthenticated",
      status: "Error"
    })
  }

  const { title, desc, category, link } = Object.fromEntries(
    Array.from(form).filter(([key]) => key !== "content"),
  );

  const slug = slugify(title as string, { lower: true, strict: true })

  try {
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

    const res = await writeClient.create({ _type: "article", ...article })

    return parseServerActionResponse({
      ...res,
      error: "",
      status: "Success"
    })
  } catch (error) {
    console.log("Error in server action: Create Article.", error);
    return parseServerActionResponse({
      error: JSON.stringify(`Error creating article: ${error}`),
      status: "Error"
    })
  }

}

export const updateArticleAction = async (prevState: any, formData: FormData, content: string, articleId: string) => {
  try {

    const session = await auth();

    if (!session) {
      return parseServerActionResponse({
        error: "Unauthenticated",
        status: "Error"
      })
    }

    const article = await client.fetch(GET_ARTICLE_BY_ID_QUERY, { id: articleId });

    if (session.id !== article.author._id) {
      return parseServerActionResponse({
        error: "Unauthenticated",
        status: "Error"
      })
    }

    const res = await writeClient.patch(articleId)
      .set({
        title: formData.get('title') as string,
        desc: formData.get('desc') as string,
        category: formData.get('category') as string,
        link: formData.get('link') as string,
        content,
      }).commit()

    revalidatePath(`/articles/${articleId}`);

    return { status: 'Success', _id: res._id }
  } catch (error) {
    console.error("Error updating article", error);
    return { status: 'Error', error: 'Error updating article' }
  }
}

export const deleteArticleAction = async (articleId: string) => {
  try {

    const session = await auth();


    if (!session) {
      return parseServerActionResponse({
        error: "Unauthenticated",
        status: "Error"
      })
    }

    const article = await client.fetch(GET_ARTICLE_BY_ID_QUERY, { id: articleId });

    if (session.id !== article.author._id) {
      return parseServerActionResponse({
        error: "Unauthenticated",
        status: "Error"
      })
    }

    const res = await writeClient.delete(articleId)
    return { status: 'Success', _id: res._id }
  } catch (error) {
    console.error("Error deleting article", error);
    return { status: 'Error', error: 'Error deleting article' }
  }
}

const MAX_LIMIT = 10
export const fetchArticlesAction = async (page: number, sanityQuery?: string | string[] | null | undefined) => {
  const start = (page - 1) * MAX_LIMIT;
  const end = page * MAX_LIMIT;

  try {
    const articles = await client.withConfig({ useCdn: false }).fetch(GET_ARTICLES_QUERY, {
      start,
      end,
      sanityQuery: sanityQuery || null,
    });
    return articles;
  } catch (error) {
    console.error(`Server: Error fetching page ${page}:`, error);
    throw error;
  }
}

/* Auth 邏輯待修改 */
export const toggleSaveArticle = async (userId: string | null | undefined, articleId: string) => {
  if (!userId || !articleId) {
    throw new Error('Missing key arguments');
  }

  const user = await client.withConfig({ useCdn: false }).fetch(
    GET_ARTICLES_SAVE_STATUS_BY_USER_ID,
    { userId }
  );

  if (!user) {
    throw new Error('User not found');
  }

  const savedArticles = user.savedArticles || [];
  const isSaved = savedArticles.some((ref: { _ref: any; }) => ref._ref === articleId);

  if (isSaved) {
    await writeClient
      .patch(userId)
      .unset([`savedArticles[_ref == "${articleId}"]`])
      .commit();
    return { isSaved: false };
  } else {
    await writeClient
      .patch(userId)
      .setIfMissing({ savedArticles: [] })
      .append('savedArticles', [{ _type: 'reference', _ref: articleId }])
      .commit();
    return { isSaved: true };
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