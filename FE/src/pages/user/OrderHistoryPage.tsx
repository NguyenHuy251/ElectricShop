import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartOutlined, InboxOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import { useOrders } from '../../hooks/useOrders';
import { formatCurrency, formatDate, getOrderStatusLabel } from '../../utils/helpers';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { Order } from '../../types';
import '../../assets/styles/pages/user-pages.css';

const getOrderStatusClass = (status: Order['trangThai']) => `order-status order-status--${status}`;

const OrderHistoryPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { userOrders, updateOrderStatus } = useOrders(currentUser?.id);
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  return (
    <div className="orders-page">
      <h1 className="orders-page__title">
        <InboxOutlined className="orders-page__title-icon" />Đơn hàng của tôi
      </h1>

      {userOrders.length === 0 ? (
        <div className="orders-empty">
          <div className="orders-empty__icon">
            <InboxOutlined />
          </div>
          <h3 className="orders-empty__title">Bạn chưa có đơn hàng nào</h3>
          <p className="orders-empty__text">Hãy mua sắm và tận hưởng những ưu đãi tuyệt vời!</p>
          <Button onClick={() => navigate('/products')}>
            <ShoppingOutlined /> Mua sắm ngay
          </Button>
        </div>
      ) : (
        <div className="orders-list">
          {userOrders.map((order) => (
            <div key={order.id} className="orders-card">
              <div className="orders-card__header">
                <div className="orders-card__meta">
                  <span className="orders-card__id">#{order.id}</span>
                  <span className="orders-card__date">{formatDate(order.ngayDatHang)}</span>
                  <span className={getOrderStatusClass(order.trangThai)}>{getOrderStatusLabel(order.trangThai)}</span>
                </div>
                <div className="orders-card__actions">
                  <span className="orders-card__total">{formatCurrency(order.tongTien)}</span>
                  <Button size="sm" variant="outline" onClick={() => setSelectedOrder(order)}>
                    Chi tiết
                  </Button>
                  {order.trangThai === 'pending' && (
                    <Button size="sm" variant="danger" onClick={() => updateOrderStatus(order.id, 'cancelled')}>
                      Hủy
                    </Button>
                  )}
                </div>
              </div>

              <div className="orders-card__preview">
                {order.chiTiet.slice(0, 3).map((item) => (
                  <div key={item.idSanPham} className="orders-card__item">
                    <img
                      src={item.hinhAnh}
                      alt={item.tenSanPham}
                      className="orders-card__thumb"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/48x48/e5e7eb/9ca3af?text=img'; }}
                    />
                    <div>
                      <p className="orders-card__item-name">{item.tenSanPham}</p>
                      <p className="orders-card__item-qty">{formatCurrency(item.gia)} × {item.soLuong}</p>
                    </div>
                  </div>
                ))}
                {order.chiTiet.length > 3 && (
                  <span className="orders-card__item-qty orders-card__more">
                    +{order.chiTiet.length - 3} sản phẩm khác
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Chi tiết đơn hàng #${selectedOrder?.id}`}
        size="lg"
      >
        {selectedOrder && (
          <div>
            <div className="order-detail__summary-grid">
              <div>
                <p className="order-detail__label">Ngày đặt</p>
                <p className="order-detail__value">{formatDate(selectedOrder.ngayDatHang)}</p>
              </div>
              <div>
                <p className="order-detail__label">Trạng thái</p>
                <span className={`${getOrderStatusClass(selectedOrder.trangThai)} order-detail__status`}>
                  {getOrderStatusLabel(selectedOrder.trangThai)}
                </span>
              </div>
              <div>
                <p className="order-detail__label">Địa chỉ giao hàng</p>
                <p className="order-detail__value">{selectedOrder.diaChi}</p>
              </div>
              <div>
                <p className="order-detail__label">Phương thức thanh toán</p>
                <p className="order-detail__value">COD</p>
              </div>
            </div>

            <h4 className="order-detail__section-title">Sản phẩm đã đặt</h4>
            <div className="order-detail__items">
              {selectedOrder.chiTiet.map((item) => (
                <div key={item.idSanPham} className="order-detail__item">
                  <img
                    src={item.hinhAnh}
                    alt={item.tenSanPham}
                    className="order-detail__thumb"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/56x56/e5e7eb/9ca3af?text=img'; }}
                  />
                  <div className="order-detail__item-body">
                    <p className="order-detail__item-name">{item.tenSanPham}</p>
                    <p className="order-detail__item-meta">
                      {formatCurrency(item.gia)} × {item.soLuong}
                    </p>
                  </div>
                  <span className="order-detail__item-total">
                    {formatCurrency(item.gia * item.soLuong)}
                  </span>
                </div>
              ))}
            </div>

            <div className="order-detail__total-row">
              <span className="order-detail__total-label">Tổng cộng</span>
              <span className="order-detail__total-value">{formatCurrency(selectedOrder.tongTien)}</span>
            </div>

            {selectedOrder.ghiChu && (
              <div className="order-detail__note">
                <HeartOutlined className="order-detail__note-icon" />Ghi chú: {selectedOrder.ghiChu}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderHistoryPage;