"use server"

import { auth } from "@/auth"
import { parseServerActionResponse } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import { GET_ARTICLES_QUERY } from "@/sanity/lib/queries";
import { writeClient } from "@/sanity/lib/write-client";
import { AnyTxtRecord } from "dns";
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

const MAX_LIMIT = 2
export const fetchArticlesAction = async (page: number, sanityQuery?: string | string[] | null | undefined) => {
  const start = (page - 1) * MAX_LIMIT;
  const end = page * MAX_LIMIT;

  try {
    const articles = await client.withConfig({ useCdn: false }).fetch(GET_ARTICLES_QUERY, {
      start,
      end,
      sanityQuery: sanityQuery || null,
    });
    console.log(`Server: Fetched page ${page}:`, articles);
    return articles;
  } catch (error) {
    console.error(`Server: Error fetching page ${page}:`, error);
    throw error;
  }
}