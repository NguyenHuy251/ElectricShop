import { httpClient } from './httpClient';
import type { ApiResponse } from '../types/api';
import type { BackendProduct } from '../types/product';

export interface BackendCartItem {
  idSanPham: number;
  soLuong: number;
  product: BackendProduct;
}

export interface CartItemPayload {
  idSanPham: number;
  soLuong: number;
}

export const getCartApi = async (): Promise<ApiResponse<BackendCartItem[]>> => {
  const response = await httpClient.get<ApiResponse<BackendCartItem[]>>('/api/cart');
  return response.data;
};

export const addCartItemApi = async (payload: CartItemPayload): Promise<ApiResponse<BackendCartItem[]>> => {
  const response = await httpClient.post<ApiResponse<BackendCartItem[]>>('/api/cart/items', payload);
  return response.data;
};

export const updateCartItemApi = async (
  productId: number,
  payload: { soLuong: number },
): Promise<ApiResponse<BackendCartItem[]>> => {
  const response = await httpClient.patch<ApiResponse<BackendCartItem[]>>(`/api/cart/items/${productId}`, payload);
  return response.data;
};

export const removeCartItemApi = async (productId: number): Promise<ApiResponse<BackendCartItem[]>> => {
  const response = await httpClient.delete<ApiResponse<BackendCartItem[]>>(`/api/cart/items/${productId}`);
  return response.data;
};

export const clearCartApi = async (): Promise<{ message: string }> => {
  const response = await httpClient.delete<{ message: string }>('/api/cart/clear');
  return response.data;
};
