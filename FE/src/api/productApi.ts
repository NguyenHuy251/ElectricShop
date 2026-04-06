import { httpClient } from './httpClient';
import type { ApiResponse } from '../types/api';
import type { Product } from '../types';
import type { BackendProduct, BackendProductImage } from '../types/product';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const splitEmbeddedHttpUrls = (value: string): string[] => {
  const matches = value.match(/https?:\/\/.*?(?=https?:\/\/|$)/gi);
  return matches?.map((item) => item.trim()) ?? [];
};

const pickBestImageUrl = (value: string): string | null => {
  const candidates = splitEmbeddedHttpUrls(value);
  if (candidates.length === 0) {
    return null;
  }

  const imageCandidate = candidates.find((url) => /\.(jpg|jpeg|png|webp|gif|avif)(\?|$)/i.test(url));
  if (imageCandidate) {
    return imageCandidate;
  }

  const cdnCandidate = candidates.find((url) => /cdn|image|img|mwg-static/i.test(url));
  return cdnCandidate ?? candidates[candidates.length - 1];
};

const looksLikeDomainUrl = (value: string): boolean => {
  return /^[a-z0-9-]+(\.[a-z0-9-]+)+([/:?#].*)?$/i.test(value);
};

export const normalizeImageInputUrl = (value: string): string => {
  const normalized = value.trim();

  if (!normalized) {
    return '';
  }

  const extractedUrl = pickBestImageUrl(normalized);
  const normalizedValue = extractedUrl ?? normalized;

  if (/^(https?:)?\/\//i.test(normalizedValue) || /^data:image\//i.test(normalizedValue) || normalizedValue.startsWith('/')) {
    return normalizedValue;
  }

  if (normalizedValue.startsWith('www.') || looksLikeDomainUrl(normalizedValue)) {
    return `https://${normalizedValue}`;
  }

  return normalizedValue;
};

const buildImageUrl = (image: string | null, fallbackText: string): string => {
  const normalizedImage = normalizeImageInputUrl(image ?? '');

  if (!normalizedImage) {
    return `https://placehold.co/800x800?text=${encodeURIComponent(fallbackText)}`;
  }

  if (/^(https?:)?\/\//i.test(normalizedImage) || /^data:image\//i.test(normalizedImage) || normalizedImage.startsWith('/')) {
    return normalizedImage;
  }

  return `${API_BASE_URL}/uploads/${normalizedImage}`;
};

const buildSpecs = (product: BackendProduct): Record<string, string> => {
  return {
    'Mã sản phẩm': product.maSanPham || '-',
    'Danh mục': product.tenDanhMuc || '-',
    'Thương hiệu': product.tenThuongHieu || '-',
    'Bảo hành': product.baoHanhThang ? `${product.baoHanhThang} tháng` : 'Chưa cập nhật',
    'Lượt bán': String(product.soLuongBan ?? 0),
    'Trạng thái': product.trangThai ? 'Đang kinh doanh' : 'Ngừng kinh doanh',
  };
};

const buildShortDescription = (description: string | null): string => {
  if (!description) {
    return '';
  }

  const firstLine = description.split('\n')[0].trim();
  return firstLine.length > 140 ? `${firstLine.slice(0, 137)}...` : firstLine;
};

export const mapBackendProductToProduct = (product: BackendProduct): Product => {
  const createdAt = new Date(product.ngayTao);
  const daysSinceCreated = Number.isNaN(createdAt.getTime())
    ? Number.POSITIVE_INFINITY
    : Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24));

  return {
    id: product.id,
    name: product.tenSanPham,
    slug: product.slug,
    categoryId: product.idDanhMuc ?? 0,
    price: product.giaBan,
    originalPrice: product.giaGoc ?? undefined,
    description: product.moTa ?? '',
    shortDescription: buildShortDescription(product.moTa),
    images: [buildImageUrl(product.hinhAnh, product.tenSanPham)],
    rating: product.danhGia || 0,
    reviewCount: Math.max(0, Math.round(product.soLuongBan / 2)),
    stock: product.trangThai ? Math.max(1, 20 - Math.min(product.soLuongBan, 15)) : 0,
    brand: product.tenThuongHieu || '',
    specs: buildSpecs(product),
    isFeatured: product.danhGia >= 4.5 || product.soLuongBan >= 20,
    isNew: daysSinceCreated <= 30,
  };
};

const mapProductPayload = (product: Omit<Product, 'id'>) => {
  const [primaryImage] = product.images;
  const normalizedPrimaryImage = normalizeImageInputUrl(primaryImage || '');

  return {
    maSanPham: product.slug.toUpperCase(),
    tenSanPham: product.name,
    slug: product.slug,
    idDanhMuc: product.categoryId || null,
    moTa: product.description || product.shortDescription || '',
    giaBan: product.price,
    giaGoc: product.originalPrice ?? null,
    baoHanhThang: Number(product.specs['Bảo hành']?.replace(/[^0-9]/g, '')) || null,
    hinhAnh: normalizedPrimaryImage || null,
    soLuongBan: Number(product.specs['Lượt bán']) || 0,
    danhGia: product.rating || 0,
    trangThai: true,
  };
};

export const getProductsApi = async (): Promise<ApiResponse<BackendProduct[]>> => {
  const response = await httpClient.get<ApiResponse<BackendProduct[]>>('/api/products');
  return response.data;
};

export const getProductByIdApi = async (id: number): Promise<ApiResponse<BackendProduct>> => {
  const response = await httpClient.get<ApiResponse<BackendProduct>>(`/api/products/${id}`);
  return response.data;
};

export const getProductBySlugApi = async (slug: string): Promise<ApiResponse<BackendProduct>> => {
  const response = await httpClient.get<ApiResponse<BackendProduct>>(`/api/products/slug/${slug}`);
  return response.data;
};

export const getProductImagesApi = async (id: number): Promise<ApiResponse<BackendProductImage[]>> => {
  const response = await httpClient.get<ApiResponse<BackendProductImage[]>>(`/api/products/${id}/images`);
  return response.data;
};

export const deleteProductImageApi = async (productId: number, imageId: number): Promise<{ message: string }> => {
  const response = await httpClient.delete<{ message: string }>(`/api/products/${productId}/images/${imageId}`);
  return response.data;
};

export const createProductApi = async (product: Omit<Product, 'id'>): Promise<ApiResponse<BackendProduct>> => {
  const response = await httpClient.post<ApiResponse<BackendProduct>>('/api/products', mapProductPayload(product));
  return response.data;
};

export const updateProductApi = async (id: number, product: Omit<Product, 'id'>): Promise<ApiResponse<BackendProduct>> => {
  const response = await httpClient.put<ApiResponse<BackendProduct>>(`/api/products/${id}`, mapProductPayload(product));
  return response.data;
};

export const deleteProductApi = async (id: number): Promise<{ message: string }> => {
  const response = await httpClient.delete<{ message: string }>(`/api/products/${id}`);
  return response.data;
};

export const mapBackendProductListToProducts = (products: BackendProduct[]): Product[] => {
  return products.map(mapBackendProductToProduct);
};