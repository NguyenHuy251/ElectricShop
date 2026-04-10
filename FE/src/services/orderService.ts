import {
  createOrderApi,
  getMyOrdersApi,
  getOrdersApi,
  updateOrderStatusApi,
  type CreateOrderPayload,
} from '../api/orderApi';
import type { OrderStatus } from '../types';

export const getOrders = () => getOrdersApi();
export const getMyOrders = () => getMyOrdersApi();
export const createOrder = (payload: CreateOrderPayload) => createOrderApi(payload);
export const updateOrderStatus = (id: number, status: OrderStatus) => updateOrderStatusApi(id, status);
