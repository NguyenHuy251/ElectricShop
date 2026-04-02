import React, { useState } from 'react';
import { FileTextOutlined, InboxOutlined, PhoneOutlined } from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import { useOrders } from '../../hooks/useOrders';
import { formatCurrency, formatDate, getOrderStatusLabel } from '../../utils/helpers';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { Order } from '../../types';
import '../../assets/styles/pages/user-pages.css';

const getOrderStatusClass = (status: Order['status']) => `order-status order-status--${status}`;

const OrdersPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { userOrders } = useOrders(currentUser?.id);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  if (userOrders.length === 0) {
    return (
      <div className="orders-empty">
        <div className="orders-empty__icon">
          <InboxOutlined />
        </div>
        <h2 className="orders-empty__title">Chưa có đơn hàng nào</h2>
        <p className="orders-empty__text">Hãy bắt đầu mua sắm để có đơn hàng đầu tiên!</p>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h1 className="orders-page__title">
        <InboxOutlined className="orders-page__title-icon" />Đơn hàng của tôi
      </h1>

      <div className="orders-list">
        {userOrders.map((order) => (
          <div key={order.id} className="orders-card">
            <div className="orders-card__header">
              <div>
                <div className="orders-card__id">Đơn hàng #{order.id}</div>
                <div className="orders-card__date">{formatDate(order.createdAt)}</div>
              </div>
              <span className={getOrderStatusClass(order.status)}>{getOrderStatusLabel(order.status)}</span>
            </div>

            <div className="orders-card__preview">
              {order.items.map((item) => (
                <div key={item.productId} className="orders-card__item">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="orders-card__thumb"
                  />
                  <div>
                    <div className="orders-card__item-name">{item.productName}</div>
                    <div className="orders-card__item-qty">x{item.quantity}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="orders-card__footer">
              <div className="orders-card__total">Tổng: {formatCurrency(order.total)}</div>
              <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                Xem chi tiết
              </Button>
            </div>
          </div>
        ))}
      </div>

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
                <div className="order-detail__label">Ngày đặt hàng</div>
                <div className="order-detail__value">{formatDate(selectedOrder.createdAt)}</div>
              </div>
              <div>
                <div className="order-detail__label">Trạng thái</div>
                <span className={`${getOrderStatusClass(selectedOrder.status)} order-detail__status`}>
                  {getOrderStatusLabel(selectedOrder.status)}
                </span>
              </div>
              <div>
                <div className="order-detail__label">Thanh toán</div>
                <div className="order-detail__value">Tiền mặt (COD)</div>
              </div>
              <div>
                <div className="order-detail__label">Địa chỉ giao hàng</div>
                <div className="order-detail__value">{selectedOrder.address}</div>
              </div>
            </div>

            <h4 className="order-detail__section-title">Sản phẩm đặt mua</h4>
            <div className="order-detail__items">
              {selectedOrder.items.map((item) => (
                <div key={item.productId} className="order-detail__item">
                  <img src={item.image} alt={item.productName} className="order-detail__thumb" />
                  <div className="order-detail__item-body">
                    <div className="order-detail__item-name">{item.productName}</div>
                    <div className="order-detail__item-meta">
                      {formatCurrency(item.price)} x {item.quantity}
                    </div>
                  </div>
                  <div className="order-detail__item-total">
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="order-detail__summary">
              <div>
                <div className="order-detail__label">Địa chỉ giao hàng</div>
                <div className="order-detail__value">{selectedOrder.address}</div>
              </div>
              <div>
                <div className="order-detail__label">Số điện thoại</div>
                <div className="order-detail__value">
                  <PhoneOutlined className="order-detail__note-icon" />{selectedOrder.phone}
                </div>
              </div>
              <div>
                <div className="order-detail__label">Ghi chú</div>
                <div className="order-detail__value">{selectedOrder.note || 'Không có'}</div>
              </div>
            </div>

            <div className="order-detail__total-row">
              <span className="order-detail__total-label">Tổng cộng</span>
              <span className="order-detail__total-value">{formatCurrency(selectedOrder.total)}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrdersPage;