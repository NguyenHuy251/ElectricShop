import { getRevenueByDateApi, getReportSummaryApi, getTopProductsApi } from '../api/reportApi';

export const getReportSummary = (params?: { fromDate?: string; toDate?: string }) => getReportSummaryApi(params);
export const getRevenueByDate = (params?: { fromDate?: string; toDate?: string }) => getRevenueByDateApi(params);
export const getTopProducts = (params?: { topN?: number; fromDate?: string; toDate?: string }) => getTopProductsApi(params);
