import { Author } from "@/sanity/types";

export type ArticleCardProps = {
  _id: string;
  title: string;
  slug?: { _type: 'slug'; current: string };
  _createdAt?: string;
  author?: Author | { _id: string; name: string; image: string; bio: string };
  views?: number;
  desc?: string;
  category?: string;
  content?: string;
  image?: string;
  likes?: number;
  likedBy?: string[];
};