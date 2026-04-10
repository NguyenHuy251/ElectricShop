import { httpClient } from './httpClient';
import type { ApiResponse } from '../types/api';
import type { Order, OrderStatus } from '../types';

export interface CreateOrderPayload {
  items: Array<{
    productId: number;
    quantity: number;
  }>;
  address: string;
  phone?: string;
  note?: string;
  paymentMethod?: string;
}

export const getOrdersApi = async (): Promise<ApiResponse<Order[]>> => {
  const response = await httpClient.get<ApiResponse<Order[]>>('/api/orders');
  return response.data;
};

export const getMyOrdersApi = async (): Promise<ApiResponse<Order[]>> => {
  const response = await httpClient.get<ApiResponse<Order[]>>('/api/orders/my');
  return response.data;
};

export const createOrderApi = async (payload: CreateOrderPayload): Promise<ApiResponse<Order>> => {
  const response = await httpClient.post<ApiResponse<Order>>('/api/orders', payload);
  return response.data;
};

export const updateOrderStatusApi = async (id: number, status: OrderStatus): Promise<{ message: string }> => {
  const response = await httpClient.patch<{ message: string }>(`/api/orders/${id}/status`, { status });
  return response.data;
};
