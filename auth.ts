import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { GET_AUTHOR_BY_GITHUB_ID_QUERY } from "./sanity/lib/queries";
import { writeClient } from "./sanity/lib/write-client";
import { client } from "./sanity/lib/client";

interface GitHubProfile {
  id: number;
  login: string;
  bio: string | null;
}

/*
  【在 OAuth 流程中加入 Sanity _id，變相使用 Sanity 驗證使用者資訊！】
  使用者點擊「 GitHub 登入」
  GitHub 驗證成功後，傳回 profile 和 access token 給 NextAuth
  signIn 回調：檢查資料並寫入 Sanity
  jwt 回調：產生 JWT，加入 Sanity 的 _id，存入 cookie
  session 回調：將 _id 放入 session，讓前端存取
  前端透過 useSession 拿到包含 _id 的 session 資料
*/

/* Docs: https://next-auth.js.org/configuration/callbacks#sign-in-callback */
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  callbacks: {
    /* OAuth 流程的第一步，當使用者嘗試登入時觸發 */
    async signIn({
      user: { name, email, image },
      profile,
    }) {

      /* Deny sign-in if profile is missing */
      if (!profile) {
        console.error("Profile is undefined, sign-in aborted");
        return false;
      }
      const ghProfile = profile as unknown as GitHubProfile;
      const { id: ghId, login, bio } = ghProfile;
      const id = ghId.toString();

      const existingUser = await client
        .withConfig({ useCdn: false }) /* Only fetch when user call */
        .fetch(GET_AUTHOR_BY_GITHUB_ID_QUERY, {
          id,
        });

      if (!existingUser) {
        await writeClient.create({
          _type: "author",
          id,
          name,
          username: login,
          email,
          image,
          bio: bio || "",
        });
      }

      return true;
    },
    /* 
      JWT 被創建或更新時觸發，e.g. 初次登入或 token 刷新時
      負責加工 token 的內容 
    */
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const user = await client
          .withConfig({ useCdn: false }) /* Only fetch when user call */
          .fetch(GET_AUTHOR_BY_GITHUB_ID_QUERY, {
            id: profile?.id,
          });

        /* Add Sanity _id to token as NextAuth data structure */
        token.id = user?._id;
      }

      return token;
    },
    /* 
    每次建立或更新客戶端的 session 物件時觸發
    e.g. useSession, getSession
    如果不更新 session，client side 只能拿到預設的資料（例如 name、email）
    而無法拿到在 jwt 中加入的 id。
     */
    async session({ session, token }) {
      /* 加入新的 attribute: session.id == token.id == Sanity _id*/
      Object.assign(session, { id: token.id });
      return session;
    },
  },
})