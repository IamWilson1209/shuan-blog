'use client';

import React, { useState, useActionState } from 'react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import MDEditor from '@uiw/react-md-editor';
import { Button } from './ui/button';
import { Send } from 'lucide-react';
import { formSchema } from '@/lib/create-form-validation';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { toast } from 'sonner';
import { ArticlePageType } from './ArticleCard';
import {
  createArticleAction,
  updateArticleAction,
} from '@/actions/server-actions';
import Image from 'next/image';

const ArticleEditForm = ({ article }: { article?: ArticlePageType }) => {
  const [content, setContent] = useState(article?.content || '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewUrl, setPreviewUrl] = useState<string>(article?.image || '');
  const router = useRouter();

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setPreviewUrl(url);
  };

  const handleFormSubmit = async (prevState: any, formData: FormData) => {
    try {
      const formValues = {
        title: formData.get('title'),
        description: formData.get('desc'),
        category: formData.get('category'),
        link: formData.get('link'),
        content,
      };

      await formSchema.parseAsync(formValues);

      const action = article ? updateArticleAction : createArticleAction;

      const res = await action(prevState, formData, content, article?._id);

      if (res.status === 'Success') {
        const isEdit = !!article;
        toast.success(
          isEdit ? 'Article has been updated' : 'Article has been created'
        );

        if (!isEdit) {
          setContent('');
        }

        router.push(`/articles/${article?._id || res._id}`);
      }

      return res;
    } catch (error) {
      console.log('Error in action form: ', error);
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors(fieldErrors as unknown as Record<string, string>);
        toast.error('Something went wrong!!');
        return { ...prevState, error: 'Validation failed', status: 'ERROR' };
      }
    }
  };

  const [state, formAction, isPending] = useActionState(handleFormSubmit, {
    error: '',
    status: 'INITIAL',
  });

  return (
    <form action={formAction} className="article-form">
      <div>
        {/* 圖片預覽區域 */}
        {previewUrl && (
          <div className="mt-2 ">
            <p className="text-md text-gray-500">Preview:</p>
            <Image
              src={previewUrl}
              alt="Preview"
              width={300}
              height={200}
              className="w-full h-auto rounded-xl mb-3 object-cover"
              onError={() => setPreviewUrl('')} // 如果圖片加載失敗，清空預覽
            />
          </div>
        )}
        <label htmlFor="title" className="article-form_label">
          Title
        </label>
        <Input
          id="title"
          name="title"
          className="article-form_input"
          required
          defaultValue={article?.title || ''}
          placeholder="Article Title"
        />
        {errors.title && <p className="article-form_error">{errors.title}</p>}
      </div>
      <div>
        <label htmlFor="description" className="article-form_label">
          Description
        </label>
        <Textarea
          id="desc"
          name="desc"
          className="article-form_textarea"
          required
          defaultValue={article?.desc || ''}
          placeholder="Article Description"
        />
        {errors.description && (
          <p className="article-form_error">{errors.description}</p>
        )}
      </div>
      <div>
        <label htmlFor="category" className="article-form_label">
          Category
        </label>
        <Input
          id="category"
          name="category"
          className="article-form_input"
          required
          defaultValue={article?.category || ''}
          placeholder="Article Category"
        />
        {errors.category && (
          <p className="article-form_error">{errors.category}</p>
        )}
      </div>
      <div>
        <label htmlFor="link" className="article-form_label">
          Image Url
        </label>
        <Input
          id="link"
          name="link"
          className="article-form_input"
          required
          defaultValue={article?.image || ''}
          placeholder="Article Image URL"
          onChange={handleUrlChange}
        />
        {errors.link && <p className="article-form_error">{errors.link}</p>}
      </div>
      <div data-color-mode="light">
        <label htmlFor="content" className="article-form_label">
          Content
        </label>
        <MDEditor
          value={content}
          onChange={(value) => setContent(value as string)}
          id="content"
          preview="edit"
          height={500}
          style={{ borderRadius: 20, overflow: 'hidden' }}
          textareaProps={{
            placeholder:
              'Briefly share what you learn or describle your idea!!',
          }}
          previewOptions={{
            disallowedElements: ['style'],
          }}
          visibleDragbar={true}
        />
        {errors.content && (
          <p className="article-form_error">{errors.content}</p>
        )}
      </div>

      <Button
        type="submit"
        className="bg-black text-white min-w-full min-h-10"
        disabled={isPending}
      >
        {isPending && <p className="article-form_pending">Loading...</p>}
        <Send className="size-6 ml-2" />
      </Button>
    </form>
  );
};

export default ArticleEditForm;
