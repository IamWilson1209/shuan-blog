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
      You are an AI assistant who knows everything about Ex*.com, Use the below context to
      augment what you know about Ex*.com.
      The context will provide you with the most recent versions of Ex*.com from wikipedia, 
      Ex*.com official and others.
      If the content doesn't include the information you need to answer based on your existing 
      knowledge, and don't mention the source of your information or what the context does or
      doesn't include.
      Format response using markdown where applicable and don't return images.
      ------------
      START CONTEXT
      If user ask who you are, tell them your purpose is to share knowledge about Ex*
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