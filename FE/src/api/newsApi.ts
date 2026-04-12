import { httpClient } from './httpClient';
import type { ApiResponse } from '../types/api';
import type { NewsArticle } from '../types';

export interface NewsPayload {
  tieuDe: string;
  slug: string;
  noiDung: string;
  hinhAnh?: string;
  ngayDang?: string;
  idNhanVienDang?: number;
}

interface LegacyNewsArticle {
  id: number;
  title: string;
  slug: string;
  content: string;
  image: string;
  publishedAt: string;
  idNhanVienDang?: number;
  tenNhanVienDang?: string;
}

const mapNews = (article: LegacyNewsArticle): NewsArticle => ({
  id: article.id,
  tieuDe: article.title,
  slug: article.slug,
  noiDung: article.content,
  hinhAnh: article.image,
  ngayDang: article.publishedAt,
  idNhanVienDang: article.idNhanVienDang,
  tenNhanVienDang: article.tenNhanVienDang,
});

export const getNewsApi = async (): Promise<ApiResponse<NewsArticle[]>> => {
  const response = await httpClient.get<ApiResponse<LegacyNewsArticle[]>>('/api/news');
  return {
    ...response.data,
    data: response.data.data.map(mapNews),
  };
};

export const getNewsBySlugApi = async (slug: string): Promise<ApiResponse<NewsArticle>> => {
  const response = await httpClient.get<ApiResponse<LegacyNewsArticle>>(`/api/news/slug/${slug}`);
  return {
    ...response.data,
    data: mapNews(response.data.data),
  };
};

export const createNewsApi = async (payload: NewsPayload): Promise<ApiResponse<NewsArticle>> => {
  const response = await httpClient.post<ApiResponse<LegacyNewsArticle>>('/api/news', {
    title: payload.tieuDe,
    slug: payload.slug,
    content: payload.noiDung,
    image: payload.hinhAnh,
    publishedAt: payload.ngayDang,
    idNhanVienDang: payload.idNhanVienDang,
  });

  return {
    ...response.data,
    data: mapNews(response.data.data),
  };
};

export const updateNewsApi = async (id: number, payload: Partial<NewsPayload>): Promise<ApiResponse<NewsArticle>> => {
  const response = await httpClient.put<ApiResponse<LegacyNewsArticle>>(`/api/news/${id}`, {
    title: payload.tieuDe,
    slug: payload.slug,
    content: payload.noiDung,
    image: payload.hinhAnh,
    publishedAt: payload.ngayDang,
    idNhanVienDang: payload.idNhanVienDang,
  });

  return {
    ...response.data,
    data: mapNews(response.data.data),
  };
};

export const deleteNewsApi = async (id: number): Promise<{ message: string }> => {
  const response = await httpClient.delete<{ message: string }>(`/api/news/${id}`);
  return response.data;
};
