import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useOrders } from '../../hooks/useOrders';
import { formatCurrency, formatDate, getOrderStatusLabel, getOrderStatusColor } from '../../utils/helpers';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { Order } from '../../types';

const OrdersPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { userOrders } = useOrders(currentUser?.id);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  if (userOrders.length === 0) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 16px', textAlign: 'center' }}>
        <div style={{ fontSize: '72px', marginBottom: '16px' }}>📦</div>
        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>
          Chưa có đơn hàng nào
        </h2>
        <p style={{ color: '#6b7280' }}>Hãy bắt đầu mua sắm để có đơn hàng đầu tiên!</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 16px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>📦 Đơn hàng của tôi</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {userOrders.map((order) => (
          <div
            key={order.id}
            style={{
              background: '#fff', borderRadius: '12px', padding: '20px',
              border: '1.5px solid #e5e7eb',
            }}
          >
            {/* Order Header */}
            <div
              style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', marginBottom: '16px',
              }}
            >
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>
                  Đơn hàng #{order.id}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                  {formatDate(order.createdAt)}
                </div>
              </div>
              <span
                style={{
                  padding: '4px 12px', borderRadius: '999px', fontSize: '13px', fontWeight: 600,
                  background: `${getOrderStatusColor(order.status)}22`,
                  color: getOrderStatusColor(order.status),
                }}
              >
                {getOrderStatusLabel(order.status)}
              </span>
            </div>

            {/* Items preview */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
              {order.items.map((item) => (
                <div key={item.productId} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f9fafb', borderRadius: '8px', padding: '8px 12px' }}>
                  <img
                    src={item.image}
                    alt={item.productName}
                    style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.productName}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>x{item.quantity}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #f3f4f6' }}>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#2563eb' }}>
                Tổng: {formatCurrency(order.total)}
              </div>
              <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                Xem chi tiết
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Order Detail Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Chi tiết đơn hàng #${selectedOrder?.id}`}
        size="lg"
      >
        {selectedOrder && (
          <div>
            {/* Status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', background: '#f9fafb', borderRadius: '8px', padding: '12px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Ngày đặt hàng</div>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>{formatDate(selectedOrder.createdAt)}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Trạng thái</div>
                <span style={{ padding: '3px 10px', borderRadius: '999px', fontSize: '13px', fontWeight: 600, background: `${getOrderStatusColor(selectedOrder.status)}22`, color: getOrderStatusColor(selectedOrder.status) }}>
                  {getOrderStatusLabel(selectedOrder.status)}
                </span>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Thanh toán</div>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>Tiền mặt (COD)</div>
              </div>
            </div>

            {/* Items */}
            <h4 style={{ margin: '0 0 12px', fontSize: '15px' }}>Sản phẩm đặt mua</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {selectedOrder.items.map((item) => (
                <div key={item.productId} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: '#f9fafb', borderRadius: '8px' }}>
                  <img src={item.image} alt={item.productName} style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '6px' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{item.productName}</div>
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>
                      {formatCurrency(item.price)} x {item.quantity}
                    </div>
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 700 }}>
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery info */}
            <div style={{ background: '#f9fafb', borderRadius: '8px', padding: '14px', marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>📍 Địa chỉ giao hàng</div>
              <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '4px' }}>{selectedOrder.address}</div>
              <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>📞 {selectedOrder.phone}</div>
              {selectedOrder.note && (
                <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>📝 {selectedOrder.note}</div>
              )}
            </div>

            {/* Total */}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px', background: '#eff6ff', borderRadius: '8px', fontSize: '18px', fontWeight: 700 }}>
              <span>Tổng cộng</span>
              <span style={{ color: '#2563eb' }}>{formatCurrency(selectedOrder.total)}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrdersPage;
