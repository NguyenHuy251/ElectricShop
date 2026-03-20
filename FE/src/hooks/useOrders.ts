import { useState, useCallback } from 'react';
import { Order, OrderStatus } from '../types';
import { orders as mockOrders } from '../data/mockData';

export const useOrders = (userId?: number) => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  const userOrders = userId
    ? orders.filter((o) => o.userId === userId)
    : orders;

  const addOrder = useCallback(
    (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order => {
      const newOrder: Order = {
        ...order,
        id: Date.now(),
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      setOrders((prev) => [newOrder, ...prev]);
      return newOrder;
    },
    []
  );

  const updateOrderStatus = useCallback((orderId: number, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status, updatedAt: new Date().toISOString().split('T')[0] }
          : o
      )
    );
  }, []);

  return { orders, userOrders, addOrder, updateOrderStatus };
};
