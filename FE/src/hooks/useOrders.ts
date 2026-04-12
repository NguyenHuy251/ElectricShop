import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { authAtom } from '../recoil/atoms/authAtom';
import { createOrder, getMyOrders, getOrders, updateOrderStatus } from '../services';
import { Order, OrderStatus } from '../types';

export const useOrders = (userId?: number) => {
  const currentUser = useRecoilValue(authAtom);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const canViewAll = currentUser?.role === 'admin' || currentUser?.isEmployee;

  const loadOrders = useCallback(async () => {
    if (!currentUser) {
      setOrders([]);
      setInitialized(true);
      return;
    }

    setLoading(true);
    try {
      const response = userId || !canViewAll ? await getMyOrders() : await getOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Khong the tai don hang:', error);
      setOrders([]);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, [canViewAll, currentUser, userId]);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  const userOrders = userId
    ? orders.filter((o) => o.idTaiKhoan === userId)
    : orders;

  const addOrder = useCallback(
    async (order: {
      items: Array<{
        idSanPham: number;
        soLuong: number;
      }>;
      diaChi: string;
      soDienThoai?: string;
      ghiChu?: string;
      phuongThucThanhToan?: string;
    }): Promise<Order> => {
      const response = await createOrder(order);
      const newOrder = response.data;
      setOrders((prev) => [newOrder, ...prev]);
      return newOrder;
    },
    []
  );

  const updateOrderStatusById = useCallback(async (orderId: number, trangThai: OrderStatus, tenNguoiXacNhan?: string) => {
    await updateOrderStatus(orderId, trangThai);
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              trangThai,
              tenNguoiXacNhan: tenNguoiXacNhan ?? o.tenNguoiXacNhan,
            }
          : o,
      ),
    );
  }, []);

  const recentOrders = useMemo(() => orders.slice(0, 5), [orders]);

  return {
    orders,
    userOrders,
    addOrder,
    updateOrderStatus: updateOrderStatusById,
    recentOrders,
    loading,
    initialized,
    reloadOrders: loadOrders,
  };
};
