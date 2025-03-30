import { auth } from '@/auth';
import ArticleEditForm from '@/components/forms/ArticleEditForm';
import ExChatSideBar from '@/components/ExChatSideBar';
import { redirect } from 'next/navigation';

const CreatePage = async () => {
  const session = await auth();

  if (!session) redirect('/');

  return (
    <div className="relative min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/3 lg:w-1/4 bg-white-100 dark:bg-black-200 border-r border-gray-200 dark:border-gray-700/30 md:fixed md:h-screen md:overflow-y-auto">
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
          <ArticleEditForm />
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
