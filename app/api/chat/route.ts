import OpenAI from "openai"
import { streamText } from "ai"
import { openai } from '@ai-sdk/openai';
import { DataAPIClient } from "@datastax/astra-db-ts"
import { NextRequest, NextResponse } from "next/server"
import dotenv from "dotenv"
dotenv.config({ path: ".env.local" });

const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const client = new DataAPIClient(process.env.ASTRA_DB_APPLICATION_TOKEN)
const db = client.db(process.env.ASTRA_DB_API_ENDPOINT, { namespace: process.env.ASTRA_DB_NAMESPACE })


export async function POST(req: NextRequest) {
  try {
    /* Read Message, latest Message, Change to json */
    const { messages } = await req.json()
    const latestMessage = messages[messages?.length - 1]?.content;

    let docContext = "";

    /* Create Embedding model */
    const embeddingResponse = await openaiClient.embeddings.create({
      model: "text-embedding-3-small",
      input: latestMessage,
      encoding_format: "float"
    })

    /* Find Similarity in Vector Database */
    const collection = await db.collection(process.env.ASTRA_DB_COLLECTION)
    const cursor = collection.find(null, {
      sort: {
        $vector: embeddingResponse.data[0].embedding,
      },
      limit: 10,
    })

    const documents = await cursor.toArray()

    const docsMap = documents?.map(doc => doc.text)

    docContext = JSON.stringify(docsMap)

    /* Take vector docs to openai model and get response */
    const template = {
      role: "system",
      content: `
      You are an AI assistant who have two main functionalities: 
      1. Helps users use a article writing website Ex* to write down their article.
      2. Use context below to introduce Ex*.com, the context is the github repository of Ex*,
          feel free to introduce Ex* by reading its code. 
      The context will provide you with the most recent versions of Ex*'s github code from github, 
      Ex*.com official website and others.
      If the content doesn't include the information you need to answer based on your existing 
      knowledge, and don't mention the source of your information or what the context does or
      doesn't include.
      Format response using markdown where applicable and don't return images.
      ------------
      START CONTEXT
      You should reply every user's question politely.
      Don't give them response over 200 words, each message has limiting numbers of letters.
      If user ask who you are, tell them your purpose is to share knowledge about Ex*.com.
      If user ask you to "Write a journey for them", tell them "Sure, provide your interested story that happened today for me".
      If user ask you to "Give me a story", tell them "Sure", and then think a interesting story with any content.
      Other information about the code of Ex*.com please refers to context below:
      ${docContext}
      END CONTEXT
      ------------
      QUESTION: ${latestMessage}
      ------------
      `
    }

    /* Response for the answers */
    const result = streamText({
      model: openai('gpt-4o'),
      messages: [template, ...messages],
    });


    /* Send back response */
    return result.toDataStreamResponse();
  } catch (error) {
    console.log("Error in chat POST api: ", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unexpexted Error',
      },
      { status: 500 }
    );
  }
}