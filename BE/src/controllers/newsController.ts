import type { Request, Response } from 'express';
import {
  createNewsService,
  deleteNewsService,
  getNewsBySlugService,
  getNewsService,
  NewsError,
  updateNewsService,
} from '../services/newsService.js';
import type { CreateNewsRequestBody, UpdateNewsRequestBody } from '../types/news.js';

const handleError = (error: unknown, res: Response): void => {
  if (error instanceof NewsError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  console.error('Unexpected error:', error instanceof Error ? error.message : error);
  res.status(500).json({ message: 'Loi he thong' });
};

export const getNewsController = async (_req: Request, res: Response): Promise<void> => {
  try {
    const news = await getNewsService();
    res.status(200).json({ message: 'Lay danh sach tin tuc thanh cong', data: news });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getNewsBySlugController = async (req: Request<{ slug: string }>, res: Response): Promise<void> => {
  const slug = req.params.slug?.trim();
  if (!slug) {
    res.status(400).json({ message: 'slug khong hop le' });
    return;
  }

  try {
    const article = await getNewsBySlugService(slug);
    res.status(200).json({ message: 'Lay bai viet thanh cong', data: article });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const createNewsController = async (
  req: Request<unknown, unknown, CreateNewsRequestBody>,
  res: Response,
): Promise<void> => {
  if (!req.body.title?.trim() || !req.body.slug?.trim() || !req.body.content?.trim()) {
    res.status(400).json({ message: 'Du lieu bai viet khong hop le' });
    return;
  }

  try {
    const created = await createNewsService(req.body);
    res.status(201).json({ message: 'Tao bai viet thanh cong', data: created });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const updateNewsController = async (
  req: Request<{ id: string }, unknown, UpdateNewsRequestBody>,
  res: Response,
): Promise<void> => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'id khong hop le' });
    return;
  }

  try {
    const updated = await updateNewsService(id, req.body);
    res.status(200).json({ message: 'Cap nhat bai viet thanh cong', data: updated });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const deleteNewsController = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'id khong hop le' });
    return;
  }

  try {
    await deleteNewsService(id);
    res.status(200).json({ message: 'Xoa bai viet thanh cong' });
  } catch (error: unknown) {
    handleError(error, res);
  }
};
