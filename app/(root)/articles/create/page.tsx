import { auth } from '@/auth';
import ArticleEditForm from '@/components/ArticleEditForm';
import ExChatSideBar from '@/components/ExChatSideBar';
import { redirect } from 'next/navigation';

const CreatePage = async () => {
  const session = await auth();

  if (!session) redirect('/');

  return (
    <>
      <section className="container mx-auto p-4">
        <h1 className="my-5 text-center text-[50px] font-extrabold font-work-sans text-black-800">
          Create Your Article
        </h1>
      </section>

      <hr />

      <ArticleEditForm />
    </>
  );
};

export default CreatePage;
