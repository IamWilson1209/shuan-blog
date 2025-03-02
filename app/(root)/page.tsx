import SearchForm from '@/components/SearchForm';
import { SanityLive } from '@/sanity/lib/live';
import LoadMoreSpinner from '@/components/LoadMoreSpinner';
import { fetchArticlesAction } from '@/actions/server-actions';
import { SquarePen } from 'lucide-react';
import { auth } from '@/auth';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = (await searchParams).query;
  const session = await auth();
  const initialArticles = await fetchArticlesAction(1, query);

  return (
    <>
      <section className="global_background">
        <h1 className="heading">Welcome to Ex*!!</h1>
        <p className="sub-heading text-center !max-w-3xl">
          Share what you've learned to make this{' '}
          <span className="idea">playground</span> more interesting!
        </p>
        <SearchForm query={query} />
      </section>

      <section className="section_container">
        <div className="flex justify-start items-center pl-4">
          <SquarePen width={45} height={45} />
          <p className="text-all-article">
            {query ? `Search result for keyword "${query}"` : 'All articles'}
          </p>
        </div>
        <LoadMoreSpinner
          initialArticles={initialArticles}
          searchQuery={query}
          // userId={session?.id}
        />
      </section>
      <SanityLive />
    </>
  );
}
