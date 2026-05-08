import { getRevenueByDateApi, getReportSummaryApi, getTopProductsApi, createSnapshotApi, getSnapshotsApi } from '../api/reportApi';

export const getReportSummary = (params?: { fromDate?: string; toDate?: string }) => getReportSummaryApi(params);
export const getRevenueByDate = (params?: { fromDate?: string; toDate?: string }) => getRevenueByDateApi(params);
export const getTopProducts = (params?: { topN?: number; fromDate?: string; toDate?: string }) => getTopProductsApi(params);
export const createSnapshot = (payload: any) => createSnapshotApi(payload);
export const getSnapshots = (params?: { topN?: number }) => getSnapshotsApi(params);
