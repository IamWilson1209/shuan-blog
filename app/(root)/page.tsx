import SearchForm from '@/components/SearchForm';
import { SanityLive } from '@/sanity/lib/live';
import LoadMoreSpinner from '@/components/LoadMoreSpinner';
import { fetchArticlesAction } from '@/actions/server-actions';
import { Newspaper } from 'lucide-react';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = (await searchParams).query;
  const initialArticles = await fetchArticlesAction(1, query);

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
        <div className="flex justify-start items-center pl-4">
          <Newspaper width={45} height={45} />
          <p className="text-all-article">
            {query ? `Search result for keyword "${query}"` : 'All articles'}
          </p>
        </div>
        <LoadMoreSpinner
          initialArticles={initialArticles}
          searchQuery={query}
        />
      </section>
      <SanityLive />
    </>
  );
}
