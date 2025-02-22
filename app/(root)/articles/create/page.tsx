import { auth } from '@/auth';
import ArticleForm from '@/components/ArticleForm';
import { redirect } from 'next/navigation';

const CreatePage = async () => {
  const session = await auth();

  if (!session) redirect('/');

  return (
    <>
      <section className="global_background !min-h-[230px]">
        <h1 className="heading">Share Your Article</h1>
      </section>

      <ArticleForm />
    </>
  );
};

export default CreatePage;
