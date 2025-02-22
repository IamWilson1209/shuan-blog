import ArticlePage, { ArticlePageType } from '@/components/ArticlePage';
import SearchForm from '@/components/SearchForm';
import { sanityFetch, SanityLive } from '@/sanity/lib/live';
import { ARTICLES_QUERY } from '@/sanity/lib/queries';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  /* { query: "XXX" } */
  const query = (await searchParams).query;
  const params = { sanityQuery: query || null };
  /*
    import {client} from "@sanity/lib/client";
    const articles = await client.fetch(ARTICLES_QUERY)
  */
  const { data: articles } = await sanityFetch({
    query: ARTICLES_QUERY,
    params,
  });

  return (
    <>
      <section className="global_background">
        <h1 className="heading">Welcome to Ex*!!</h1>
        <p className="sub-heading !max-w-3xl">
          Write some <span className="idea"> ideas </span> to make this public
          playground more interested
        </p>
        <SearchForm query={query} />
      </section>

      <section className="section_container">
        <p className="text-all-article">
          {query ? `Search result for keyword "${query}"` : 'All articles'}
        </p>
        <ul className="mt-7 card_grid">
          {articles.length > 0 ? (
            articles.map((article: ArticlePageType) => (
              <ArticlePage key={article?._id} article={article} />
            ))
          ) : (
            <p className="no-results">No articles found</p>
          )}
        </ul>
      </section>
      <SanityLive />
    </>
  );
}
