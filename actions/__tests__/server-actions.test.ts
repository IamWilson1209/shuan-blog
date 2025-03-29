// __tests__/server-actions.test.ts

import { auth } from "@/auth";
import { createArticleAction } from "../server-actions";
import { writeClient } from "@/sanity/lib/write-client";

// Mock 外部依賴
jest.mock('@/auth', () => ({
  auth: jest.fn(),
}));
jest.mock('@/sanity/lib/write-client', () => ({
  writeClient: {
    create: jest.fn(),
  },
}));
jest.mock('@/sanity/lib/client', () => ({
  client: {
    fetch: jest.fn(),
  },
}));
jest.mock('../server-actions', () => {
  const actual = jest.requireActual('../server-actions');
  return {
    ...actual,
    parseServerActionResponse: jest.fn((data) => data),
  };
});

console.log('createArticleAction:', createArticleAction);

describe('createArticleAction', () => {
  const mockFormData = new FormData();
  mockFormData.append('title', 'Test Article');
  mockFormData.append('desc', 'Test Description');
  mockFormData.append('category', 'Test Category');
  mockFormData.append('link', 'https://example.com/image.jpg');
  const mockContent = 'Test content';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 測試未登入的情況
  it('should return error if user is not authenticated', async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    const result = await createArticleAction({}, mockFormData, mockContent);

    expect(auth).toHaveBeenCalled();
    expect(result).toEqual({
      error: 'Unauthenticated',
      status: 'Error',
    });
  });

  // 測試成功建立文章的情況
  it('should create an article successfully when authenticated', async () => {
    (auth as jest.Mock).mockResolvedValue({ id: 'user123' });
    (writeClient.create as jest.Mock).mockResolvedValue({
      _id: 'article123',
      title: 'Test Article',
    });

    const result = await createArticleAction({}, mockFormData, mockContent);

    expect(auth).toHaveBeenCalled();
    expect(writeClient.create).toHaveBeenCalledWith({
      _type: 'article',
      title: 'Test Article',
      desc: 'Test Description',
      category: 'Test Category',
      image: 'https://example.com/image.jpg',
      slug: {
        _type: 'test-article',
        current: 'test-article',
      },
      author: {
        _type: 'reference',
        _ref: 'user123',
      },
      content: 'Test content',
    });
    expect(result).toEqual({
      _id: 'article123',
      title: 'Test Article',
      error: '',
      status: 'Success',
    });
  });

  // 測試建立文章失敗的情況
  it('should return error if article creation fails', async () => {
    (auth as jest.Mock).mockResolvedValue({ id: 'user123' });
    (writeClient.create as jest.Mock).mockRejectedValue(new Error('Sanity error'));

    const result = await createArticleAction({}, mockFormData, mockContent);

    expect(auth).toHaveBeenCalled();
    expect(writeClient.create).toHaveBeenCalled();
    expect(result).toEqual({
      error: JSON.stringify('Error creating article'),
      status: 'Error',
    });
  });
});