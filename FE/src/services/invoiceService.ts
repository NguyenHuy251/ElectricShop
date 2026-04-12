import { getInvoiceByOrderApi, getInvoicesApi } from '../api/invoiceApi';

export const getInvoices = () => getInvoicesApi();
export const getInvoiceByOrder = (orderId: number) => getInvoiceByOrderApi(orderId);
