export const COLORS = {
  primary: '#1565C0',
  primaryDark: '#0D47A1',
  primaryLight: '#42A5F5',
  primaryBg: '#E3F2FD',
  accent: '#FF6D00',
  accentLight: '#FF9800',
  accentBg: '#FFF3E0',
  background: '#F5F7FA',
  surface: '#FFFFFF',
  border: '#E0E0E0',
  borderLight: '#F0F0F0',
  text: '#212121',
  textSecondary: '#616161',
  textLight: '#9E9E9E',
  success: '#2E7D32',
  successBg: '#E8F5E9',
  error: '#C62828',
  errorBg: '#FFEBEE',
  warning: '#E65100',
  warningBg: '#FFF3E0',
  info: '#0277BD',
  infoBg: '#E1F5FE',
  star: '#FFC107',
} as const;

export const ORDER_STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  pending:   { label: 'Chờ xác nhận', color: '#E65100', bg: '#FFF3E0' },
  confirmed: { label: 'Đã xác nhận', color: '#0277BD', bg: '#E1F5FE' },
  shipping:  { label: 'Đang giao',    color: '#7B1FA2', bg: '#F3E5F5' },
  delivered: { label: 'Đã giao',      color: '#2E7D32', bg: '#E8F5E9' },
  cancelled: { label: 'Đã hủy',       color: '#C62828', bg: '#FFEBEE' },
};

export const PAYMENT_METHODS = [
  { value: 'cod',      label: 'Thanh toán khi nhận hàng (COD)' },
  { value: 'banking',  label: 'Chuyển khoản ngân hàng' },
  { value: 'momo',     label: 'Ví MoMo' },
  { value: 'vnpay',    label: 'VNPay' },
];

export const SORT_OPTIONS = [
  { value: 'default',  label: 'Mặc định' },
  { value: 'price_asc', label: 'Giá tăng dần' },
  { value: 'price_desc', label: 'Giá giảm dần' },
  { value: 'newest',   label: 'Mới nhất' },
  { value: 'popular',  label: 'Bán chạy nhất' },
  { value: 'rating',   label: 'Đánh giá cao' },
];

export const PAGE_SIZE = 8;
