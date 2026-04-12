import {
  createNews,
  deleteNews,
  getNews,
  getNewsBySlug,
  updateNews,
} from '../repositories/newsRepository.js';
import type {
  CreateNewsRequestBody,
  NewsPublic,
  NewsRow,
  UpdateNewsRequestBody,
} from '../types/news.js';

export class NewsError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = 'NewsError';
    this.statusCode = statusCode;
  }
}

const mapNews = (row: NewsRow): NewsPublic => ({
  id: row.id,
  title: row.tieuDe,
  slug: row.slug,
  content: row.noiDung,
  image: row.hinhAnh ?? 'news-default.jpg',
  publishedAt: row.ngayDang.toISOString().slice(0, 10),
  idNhanVienDang: row.idNhanVienDang ?? undefined,
  tenNhanVienDang: row.tenNhanVienDang ?? undefined,
});

export const getNewsService = async (): Promise<NewsPublic[]> => {
  const rows = await getNews();
  return rows.map(mapNews);
};

export const getNewsBySlugService = async (slug: string): Promise<NewsPublic> => {
  const row = await getNewsBySlug(slug);
  if (!row) throw new NewsError('Khong tim thay bai viet', 404);
  return mapNews(row);
};

export const createNewsService = async (payload: CreateNewsRequestBody): Promise<NewsPublic> => {
  const created = await createNews(payload);
  if (!created) throw new NewsError('Khong the tao bai viet', 500);
  return mapNews(created);
};

export const updateNewsService = async (id: number, payload: UpdateNewsRequestBody): Promise<NewsPublic> => {
  const updated = await updateNews(id, payload);
  if (!updated) throw new NewsError('Khong the cap nhat bai viet', 500);
  return mapNews(updated);
};

export const deleteNewsService = async (id: number): Promise<void> => {
  const affectedRows = await deleteNews(id);
  if (affectedRows === 0) throw new NewsError('Khong tim thay bai viet de xoa', 404);
};
