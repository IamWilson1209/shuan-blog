import { client } from '@/sanity/lib/client';
import { GET_ARTICLE_VIEWS_BY_ID_QUERY } from '@/sanity/lib/queries';
import { writeClient } from '@/sanity/lib/write-client';
import { after } from 'next/server';
import React from 'react';
import Ping from './Ping';

const Views = async ({ id }: { id: string }) => {
  const { views: totalViews } = await client
    .withConfig({ useCdn: false })
    .fetch(GET_ARTICLE_VIEWS_BY_ID_QUERY, { id });

  /* 
    Docs: https://nextjs.org/docs/app/api-reference/functions/after
    after allows you to schedule work to be executed after a response (or prerender) is finished. 
  */
  after(
    async () =>
      await writeClient
        .patch(id)
        .set({ views: totalViews + 1 })
        .commit()
  );

  return (
    <div className="view-container">
      <div className="absolute -top-2 -right-2">
        <Ping />
      </div>

      <p className="view-text">
        <span className="font-black">Views: {totalViews}</span>
      </p>
    </div>
  );
};

export default Views;
