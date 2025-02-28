import { auth } from '@/auth';
import ArticleEditForm from '@/components/ArticleEditForm';
import { client } from '@/sanity/lib/client';
import { GET_ARTICLE_BY_ID_QUERY } from '@/sanity/lib/queries';
import { notFound, redirect } from 'next/navigation';

const EditPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  const session = await auth();

  if (!session) redirect('/');

  const article = await client.fetch(GET_ARTICLE_BY_ID_QUERY, { id });

  if (!article) return notFound();

  if (article.author._id !== session?.id) return <div>Unauthorized</div>;

  return (
    <div className="container max-w-full mx-auto">
      <ArticleEditForm article={article} />
    </div>
  );
};

export default EditPage;
