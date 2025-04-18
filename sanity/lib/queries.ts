import { defineQuery } from "next-sanity";

export const GET_ARTICLES_QUERY =
  defineQuery(`*[_type == "article" && defined(slug.current) && !defined($sanityQuery) || title match $sanityQuery || category match $sanityQuery || author->name match $sanityQuery] | order(_createdAt desc) [$start...$end] {
  _id, 
  title, 
  slug,
  _createdAt,
  author -> {
    _id, name, username, image, bio
  }, 
  views,
  desc,
  category,
  image,
  likes,
  "likedBy": likedBy[]->_id
}`);

export const GET_ARTICLE_BY_ID_QUERY =
  defineQuery(`*[_type == "article" && _id == $id][0] {
  _id, 
  title, 
  slug,
  _createdAt,
  author -> {
    _id, name, username, image, bio
  }, 
  views,
  desc,
  category,
  image,
  content,
  likes,
  "likedBy": likedBy[]->_id
}`);

export const GET_AUTHOR_BY_ID_QUERY =
  defineQuery(`*[_type == "author" && _id == $id][0] {
  _id, 
  id,
  name,
  username,
  email,
  image,
  bio,
  "savedArticles": savedArticles[]->_id
}`);

export const GET_USER_SAVED_ARTICLES = defineQuery(
  `*[_type == "author" && _id == $userId][0]{"savedArticles": savedArticles[]->_id}`
)

export const GET_USER_LIKED_ARTICLES = defineQuery(
  `*[_type == "article" && $userId in likedBy[]._ref] {_id}`)

export const GET_AUTHOR_BY_GITHUB_ID_QUERY = defineQuery(`
  *[_type == "author" && id == $id][0]{
      _id,
      id,
      name,
      username,
      email,
      image,
      bio
  }
  `);

export const GET_ARTICLE_VIEWS_BY_ID_QUERY = defineQuery(
  `*[_type == "article" && _id == $id][0]{
  _id, views
  }`)

export const GET_ARTICLE_LIKES_LIKEDBY_BY_ID_QUERY = defineQuery(
  `*[_type == "article" && _id == $id][0]{likes, "likedBy": likedBy[]->_id}`
)


export const GET_ARTICLES_BY_AUTHOR_QUERY = defineQuery(
  `*[_type == "article" && author._ref == $id] | order(_createdAt desc){
  _id, 
  title, 
  slug,
  _createdAt,
  author -> {
    _id, name, image, bio
  }, 
  views,
  desc,
  category,
  image,
  likes,
  "likedBy": likedBy[]->_id
  }`)

export const GET_USERPAGE_DATA_QUERY = defineQuery(`
  *[_type == "author" && _id == $userId][0] {
    _id,
    id,
    name,
    username,
    email,
    image,
    bio,
    "savedArticles": savedArticles[]->_id,
    "articles": *[_type == "article" && author._ref == $userId] | order(_createdAt desc) {
      _id,
      title,
      slug,
      _createdAt,
      author -> {
        _id, name, image, bio
      },
      views,
      desc,
      category,
      image,
      likes,
      "likedBy": likedBy[]->_id
    }
  }
`);

export const GET_PLAYLIST_BY_SLUG_QUERY =
  defineQuery(`*[_type == "playlist" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  select[]->{
    _id,
    _createdAt,
    title,
    slug,
    author->{
      _id,
      name,
      slug,
      image,
      bio
    },
    views,
    desc,
    category,
    image,
  }
}`)