import { DataAPIClient } from '@datastax/astra-db-ts'
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import OpenAI from "openai"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import puppeteer from "puppeteer";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// 初始 URL
const baseUrl = "https://github.com/IamWilson1209/Blogapp";
let relatedData: string[] = []; // 儲存所有相關連結

// 自動收集相關連結的函數
const collectRelatedUrls = async (startUrl: string): Promise<string[]> => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const visited = new Set<string>(); // 避免重複訪問
  const urlsToVisit = [startUrl];
  const collectedUrls: string[] = [];

  while (urlsToVisit.length > 0) {
    const currentUrl = urlsToVisit.pop();
    if (!currentUrl || visited.has(currentUrl)) continue;

    visited.add(currentUrl);
    console.log(`正在訪問: ${currentUrl}`);

    try {
      await page.goto(currentUrl, { waitUntil: "domcontentloaded" });
      const links = await page.evaluate(() => {
        const anchors = Array.from(document.querySelectorAll("a"));
        return anchors.map((a) => a.href).filter((href) => href); // 過濾空連結
      });

      for (const link of links) {
        // 只收集以 baseUrl 開頭的連結
        if ((link.startsWith("https://github.com/IamWilson1209/Blogapp/tree") ||
          link.startsWith("https://github.com/IamWilson1209/Blogapp/blob")) &&
          !visited.has(link)) {
          collectedUrls.push(link);
          urlsToVisit.push(link); // 添加到待訪問清單
        }
      }
    } catch (error) {
      console.error(`無法訪問 ${currentUrl}: ${error}`);
    }
  }

  await browser.close();
  return [...new Set(collectedUrls)]; // 移除重複連結
};


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
}

const loadSampleData = async () => {
  const collection = await db.collection(process.env.ASTRA_DB_COLLECTION)

  relatedData = await collectRelatedUrls(baseUrl);

  for (const url of relatedData) {
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
loadSampleData().catch((err) => console.error("發生錯誤:", err));