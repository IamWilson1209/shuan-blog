'use client';

import React, { useState, useActionState } from 'react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import MDEditor from '@uiw/react-md-editor';
import { Button } from './ui/button';
import { Send } from 'lucide-react';
import { formSchema } from '@/lib/create-form-validation';
import { createArticleAction } from '@/actions/create-article-action';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { toast } from 'sonner';

const ArticleForm = () => {
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

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

      console.log('formValues: ', formValues);

      const res = await createArticleAction(prevState, formData, content);

      console.log('res: ', res);

      if (res.status == 'Success') {
        toast('Article has been created', {
          description: 'Your article has been created successfully',
        });
        setContent('');

        router.push(`/articles/${res._id}`);
      }

      return res;
    } catch (error) {
      console.log('Error in action form: ', error);
      if (error instanceof z.ZodError) {
        const fieldErorrs = error.flatten().fieldErrors;

        setErrors(fieldErorrs as unknown as Record<string, string>);

        toast('Something went wrong!!', {
          description: 'Please check your inputs and try again',
        });

        return { ...prevState, error: 'Validation failed', status: 'ERROR' };
      }
    }
  };

  const [state, formAction, isPending] = useActionState(handleFormSubmit, {
    error: '',
    status: 'INITIAL',
  });

  return (
    <form action={formAction} className="startup-form">
      <div>
        <label htmlFor="title" className="startup-form_label">
          Title
        </label>
        <Input
          id="title"
          name="title"
          className="startup-form_input"
          required
          placeholder="Article Title"
        />
        {errors.title && <p className="startup-form_error">{errors.title}</p>}
      </div>
      <div>
        <label htmlFor="description" className="startup-form_label">
          Description
        </label>
        <Textarea
          id="desc"
          name="desc"
          className="startup-form_textarea"
          required
          placeholder="Article Description"
        />
        {errors.description && (
          <p className="startup-form_error">{errors.title}</p>
        )}
      </div>
      <div>
        <label htmlFor="category" className="startup-form_label">
          Category
        </label>
        <Input
          id="category"
          name="category"
          className="startup-form_input"
          required
          placeholder="Article Category"
        />
        {errors.category && (
          <p className="startup-form_error">{errors.title}</p>
        )}
      </div>
      <div>
        <label htmlFor="link" className="startup-form_label">
          Image Url
        </label>
        <Input
          id="link"
          name="link"
          className="startup-form_input"
          required
          placeholder="Article Image URL"
        />
        {errors.link && <p className="startup-form_error">{errors.title}</p>}
      </div>
      <div data-color-mode="light">
        <label htmlFor="content" className="startup-form_label">
          Content
        </label>
        <MDEditor
          value={content}
          onChange={(value) => setContent(value as string)}
          id="content"
          preview="edit"
          height={300}
          style={{ borderRadius: 20, overflow: 'hidden' }}
          textareaProps={{
            placeholder:
              'Briefly share what you learn or describle your idea!!',
          }}
          previewOptions={{
            disallowedElements: ['style'],
          }}
        />

        {errors.pitch && <p className="startup-form_error">{errors.pitch}</p>}
      </div>

      <Button
        type="submit"
        className="startup-form_btn text-white"
        disabled={isPending}
      >
        {isPending && <p className="startup-form_pending">Loading...</p>}
        <Send className="size-6 ml-2" />
      </Button>
    </form>
  );
};

export default ArticleForm;
