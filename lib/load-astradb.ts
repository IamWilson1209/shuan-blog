import { DataAPIClient } from '@datastax/astra-db-ts'
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import OpenAI from "openai"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const f1Data = [
  "https://zh.wikipedia.org/zh-tw/LangChain",
  "https://www.langchain.com/",

]

const client = new DataAPIClient(process.env.ASTRA_DB_APPLICATION_TOKEN)
const db = client.db(process.env.ASTRA_DB_API_ENDPOINT, { namespace: process.env.ASTRA_DB_NAMESPACE })

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512,
  chunkOverlap: 100
})


type SimilarityMetric = "dot_product" | "cosine" | "euclidean"
const createCollection = async (similarityMetric: SimilarityMetric = "dot_product") => {
  const res = await db.createCollection(process.env.ASTRA_DB_COLLECTION, {
    vector: {
      dimension: 1536,
      metric: similarityMetric
    }
  })
  console.log("createCollection response: ", res)
}

const loadSampleData = async () => {
  const collection = await db.collection(process.env.ASTRA_DB_COLLECTION)
  for (const url of f1Data) {
    const content = await scrapePage(url)
    const chunks = await splitter.splitText(content)
    for await (const chunk of chunks) {
      const embedding = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: chunk,
        encoding_format: "float"
      })
      const vector = embedding.data[0].embedding

      const res = await collection.insertOne({
        $vector: vector,
        text: chunk
      })

      console.log("loadSampleData res...", res)
    }
  }
}


const scrapePage = async (url: string) => {
  const loader = new PuppeteerWebBaseLoader(url, {
    launchOptions: {
      headless: true
    },
    gotoOptions: {
      waitUntil: "domcontentloaded"
    },
    evaluate: async (page, browser) => {
      const content = await page.evaluate(() => document.body.innerHTML)
      await browser.close();
      return content
    }
  })
  return (await loader.scrape())?.replace(/<[^>]*>/gm, '')
}

// createCollection().then(() => loadSampleData())

loadSampleData()