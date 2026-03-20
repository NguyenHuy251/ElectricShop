export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(amount);

export const formatDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' });

export const calcDiscount = (original: number, sale: number): number =>
  Math.round(((original - sale) / original) * 100);

export const truncate = (text: string, max: number): string =>
  text.length <= max ? text : text.substring(0, max) + '...';

export const generateOrderCode = (): string =>
  'DH' + Date.now().toString().slice(-8);
