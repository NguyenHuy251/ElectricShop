export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export const calcDiscountPercent = (original: number, current: number): number =>
  Math.round(((original - current) / original) * 100);

export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const truncate = (text: string, maxLen: number): string =>
  text.length > maxLen ? text.slice(0, maxLen) + '...' : text;

export const getOrderStatusLabel = (status: string): string => {
  const map: Record<string, string> = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    shipping: 'Đang giao hàng',
    delivered: 'Đã giao hàng',
    cancelled: 'Đã hủy',
  };
  return map[status] || status;
};

export const getOrderStatusColor = (status: string): string => {
  const map: Record<string, string> = {
    pending: '#f59e0b',
    confirmed: '#3b82f6',
    shipping: '#8b5cf6',
    delivered: '#10b981',
    cancelled: '#ef4444',
  };
  return map[status] || '#6b7280';
};

export const renderStars = (rating: number): string => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - (half ? 1 : 0));
};
