import {
  createNewsApi,
  deleteNewsApi,
  getNewsApi,
  getNewsBySlugApi,
  updateNewsApi,
  type NewsPayload,
} from '../api/newsApi';

export const getNews = () => getNewsApi();
export const getNewsBySlug = (slug: string) => getNewsBySlugApi(slug);
export const createNews = (payload: NewsPayload) => createNewsApi(payload);
export const updateNews = (id: number, payload: Partial<NewsPayload>) => updateNewsApi(id, payload);
export const deleteNews = (id: number) => deleteNewsApi(id);
