"use server"

import { auth } from "@/auth"
import { parseServerActionResponse } from "@/lib/utils";
import { writeClient } from "@/sanity/lib/write-client";
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

  const { title, description, category, link } = Object.fromEntries(
    Array.from(form).filter(([key]) => key !== "content"),
  );

  const slug = slugify(title as string, { lower: true, strict: true })

  try {
    const article = {
      title,
      description,
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

    console.log("article: ", article)

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