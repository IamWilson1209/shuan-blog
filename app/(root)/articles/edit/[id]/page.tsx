import { auth } from '@/auth';
import ArticleEditForm from '@/components/ArticleEditForm';
import ExChatSideBar from '@/components/ExChatSideBar';
import { client } from '@/sanity/lib/client';
import { GET_ARTICLE_BY_ID_QUERY } from '@/sanity/lib/queries';
import { notFound, redirect } from 'next/navigation';

const EditPage = async ({ params }: { params?: Promise<{ id: string }> }) => {
  const id = (await params)?.id;

  const session = await auth();

  if (!session) redirect('/');

  const article = await client.fetch(GET_ARTICLE_BY_ID_QUERY, { id });

  if (!article) return notFound();

  if (article.author._id !== session?.id) return <div>Unauthorized</div>;

  return (
    <div className="relative min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/3 lg:w-1/4 bg-white-100 dark:bg-black-200 border-r border-gray-200 dark:border-gray-700 p-4 md:fixed md:h-screen md:overflow-y-auto">
        <ExChatSideBar />
      </div>

      <div className="w-full md:w-2/3 lg:w-3/4 md:ml-[33%] lg:ml-[25%] p-4">
        <section className="container mx-auto">
          <h1 className="my-5 text-center text-[50px] font-extrabold font-work-sans text-black-800">
            Create Your Article
          </h1>
        </section>

        <hr />

        <div className="container mx-auto">
          <ArticleEditForm article={article} />
        </div>
      </div>
    </div>
  );
};

export default EditPage;
