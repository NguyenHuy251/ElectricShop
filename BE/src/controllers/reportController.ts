import type { Request, Response } from 'express';
import {
  ReportError,
  getReportSummaryService,
  getRevenueByDateService,
  getTopProductsService,
  createBaoCaoDoanhThuService,
  getBaoCaoDoanhThuListService,
} from '../services/reportService.js';

const handleError = (error: unknown, res: Response): void => {
  if (error instanceof ReportError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  console.error('Unexpected error:', error instanceof Error ? error.message : error);
  res.status(500).json({ message: 'Loi he thong' });
};

export const getReportSummaryController = async (req: Request, res: Response): Promise<void> => {
  try {
    const fromDate = typeof req.query.fromDate === 'string' ? req.query.fromDate : undefined;
    const toDate = typeof req.query.toDate === 'string' ? req.query.toDate : undefined;
    const summary = await getReportSummaryService(fromDate, toDate);
    res.status(200).json({ message: 'Lay bao cao tong quan thanh cong', data: summary });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getRevenueByDateController = async (req: Request, res: Response): Promise<void> => {
  try {
    const fromDate = typeof req.query.fromDate === 'string' ? req.query.fromDate : undefined;
    const toDate = typeof req.query.toDate === 'string' ? req.query.toDate : undefined;
    const revenue = await getRevenueByDateService(fromDate, toDate);
    res.status(200).json({ message: 'Lay bao cao doanh thu theo ngay thanh cong', data: revenue });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getTopProductsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const fromDate = typeof req.query.fromDate === 'string' ? req.query.fromDate : undefined;
    const toDate = typeof req.query.toDate === 'string' ? req.query.toDate : undefined;
    const topNQuery = typeof req.query.topN === 'string' ? Number(req.query.topN) : undefined;
    const topProducts = await getTopProductsService(topNQuery, fromDate, toDate);
    res.status(200).json({ message: 'Lay bao cao san pham ban chay thanh cong', data: topProducts });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const createBaoCaoDoanhThuController = async (req: Request, res: Response): Promise<void> => {
  try {
    const payload = req.body;
    const id = await createBaoCaoDoanhThuService(payload);
    res.status(201).json({ message: 'Luu bao cao thanh cong', data: { id } });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getBaoCaoDoanhThuListController = async (req: Request, res: Response): Promise<void> => {
  try {
    const topN = typeof req.query.topN === 'string' ? Number(req.query.topN) : 50;
    const rows = await getBaoCaoDoanhThuListService(topN);
    res.status(200).json({ message: 'Lay danh sach bao cao thanh cong', data: rows });
  } catch (error: unknown) {
    handleError(error, res);
  }
};
