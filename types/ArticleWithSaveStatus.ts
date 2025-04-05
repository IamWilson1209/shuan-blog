export type ArticleWithSaveStatus = {
  _id: string;
  title: string;
  slug: {
    _type: 'slug';
    current: string;
  };
  _createdAt: string;
  author: {
    _id: string;
    name: string;
    image: string;
    bio: string;
  };
  views: number;
  desc: string;
  category: string;
  image: string;
  likes: number;
  likedBy: string[];
  saveStatus: boolean;
};