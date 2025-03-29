'use client';

import Form from 'next/form';
import { Search } from 'lucide-react';
import SearchFormResetButton from '../Buttons/SearchFormResetButton';
import { FormEvent } from 'react';
import { useRouter } from 'next/navigation';

const SearchForm = ({ query }: { query?: string | string[] | undefined }) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const router = useRouter();
    event.preventDefault(); // 阻止默認表單提交行為
    const formData = new FormData(event.currentTarget);
    const searchQuery = formData.get('query')?.toString();

    // 構建新的 URL
    const newUrl = searchQuery
      ? `/?query=${encodeURIComponent(searchQuery)}`
      : '/';
    router.push(newUrl); // 導航到新 URL
  };

  return (
    <Form
      action="/"
      scroll={false}
      className="search-form"
      onSubmit={handleSubmit}
    >
      {/* On submission, the input value will be appended to 
          the URL, e.g. /search?query=abc */}
      <input
        name="query"
        defaultValue={query}
        className="search-input"
        placeholder="Search Articles"
      />
      <div className="flex gap-2">
        {query && <SearchFormResetButton />}

        <button type="submit" className="search-btn text-white">
          <Search className="size-5" />
        </button>
      </div>
    </Form>
  );
};

export default SearchForm;
