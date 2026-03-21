import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartOutlined, InboxOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import { useOrders } from '../../hooks/useOrders';
import { formatCurrency, formatDate, getOrderStatusLabel, getOrderStatusColor } from '../../utils/helpers';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { Order } from '../../types';

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
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}><InboxOutlined style={{ marginRight: 8 }} />Đơn hàng của tôi</h1>

      {userOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 16px', background: '#fff', borderRadius: 12 }}>
          <div style={{ fontSize: 72, marginBottom: 16 }}><InboxOutlined /></div>
          <h3 style={{ color: '#374151', marginBottom: 8 }}>Bạn chưa có đơn hàng nào</h3>
          <p style={{ color: '#6b7280', marginBottom: 24 }}>Hãy mua sắm và tận hưởng những ưu đãi tuyệt vời!</p>
          <Button onClick={() => navigate('/products')}><ShoppingOutlined /> Mua sắm ngay</Button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {userOrders.map((order) => (
            <div key={order.id} style={{
              background: '#fff', borderRadius: 12, overflow: 'hidden',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f3f4f6',
            }}>
              {/* Order header */}
              <div style={{
                padding: '14px 20px', display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', borderBottom: '1px solid #f9fafb',
                background: '#fafafa',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>#{order.id}</span>
                  <span style={{ fontSize: 13, color: '#6b7280' }}>{formatDate(order.createdAt)}</span>
                  <span style={{
                    padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600,
                    background: getOrderStatusColor(order.status) + '22',
                    color: getOrderStatusColor(order.status),
                  }}>
                    {getOrderStatusLabel(order.status)}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontWeight: 700, fontSize: 15, color: '#2563eb' }}>
                    {formatCurrency(order.total)}
                  </span>
                  <Button size="sm" variant="outline" onClick={() => setSelectedOrder(order)}>Chi tiết</Button>
                  {order.status === 'pending' && (
                    <Button size="sm" variant="danger" onClick={() => updateOrderStatus(order.id, 'cancelled')}>
                      Hủy
                    </Button>
                  )}
                </div>
              </div>

              {/* Order items preview */}
              <div style={{ padding: '14px 20px', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {order.items.slice(0, 3).map((item) => (
                  <div key={item.productId} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img
                      src={item.image}
                      alt={item.productName}
                      style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }}
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/48x48/e5e7eb/9ca3af?text=img'; }}
                    />
                    <div>
                      <p style={{ margin: 0, fontSize: 12, fontWeight: 500, color: '#374151', maxWidth: 180,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.productName}
                      </p>
                      <p style={{ margin: 0, fontSize: 11, color: '#9ca3af' }}>
                        {formatCurrency(item.price)} × {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
                {order.items.length > 3 && (
                  <span style={{ fontSize: 12, color: '#9ca3af', alignSelf: 'center' }}>
                    +{order.items.length - 3} sản phẩm khác
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order detail modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Chi tiết đơn hàng #${selectedOrder?.id}`}
        size="lg"
      >
        {selectedOrder && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20,
              padding: 16, background: '#f9fafb', borderRadius: 8 }}>
              <div>
                <p style={infoLabel}>Ngày đặt</p>
                <p style={infoValue}>{formatDate(selectedOrder.createdAt)}</p>
              </div>
              <div>
                <p style={infoLabel}>Trạng thái</p>
                <span style={{
                  padding: '3px 10px', borderRadius: 99, fontSize: 13, fontWeight: 600,
                  background: getOrderStatusColor(selectedOrder.status) + '22',
                  color: getOrderStatusColor(selectedOrder.status),
                }}>
                  {getOrderStatusLabel(selectedOrder.status)}
                </span>
              </div>
              <div>
                <p style={infoLabel}>Địa chỉ giao hàng</p>
                <p style={infoValue}>{selectedOrder.address}</p>
              </div>
              <div>
                <p style={infoLabel}>Phương thức thanh toán</p>
                <p style={infoValue}>COD</p>
              </div>
            </div>

            <h4 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 600 }}>Sản phẩm đã đặt</h4>
            {selectedOrder.items.map((item) => (
              <div key={item.productId} style={{
                display: 'flex', gap: 12, alignItems: 'center',
                padding: '10px 0', borderBottom: '1px solid #f3f4f6',
              }}>
                <img src={item.image} alt={item.productName}
                  style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 6 }}
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/56x56/e5e7eb/9ca3af?text=img'; }}
                />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 500, fontSize: 14 }}>{item.productName}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 13, color: '#6b7280' }}>
                    {formatCurrency(item.price)} × {item.quantity}
                  </p>
                </div>
                <span style={{ fontWeight: 600, color: '#2563eb' }}>
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}

            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '2px solid #e5e7eb',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: 16 }}>Tổng cộng</span>
              <span style={{ fontWeight: 700, fontSize: 20, color: '#2563eb' }}>
                {formatCurrency(selectedOrder.total)}
              </span>
            </div>

            {selectedOrder.note && (
              <div style={{ marginTop: 12, padding: 12, background: '#fffbeb', borderRadius: 8, fontSize: 13, color: '#92400e' }}>
                <HeartOutlined style={{ marginRight: 6 }} />Ghi chú: {selectedOrder.note}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

const infoLabel: React.CSSProperties = { margin: '0 0 2px', fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', fontWeight: 600 };
const infoValue: React.CSSProperties = { margin: 0, fontSize: 14, fontWeight: 500, color: '#111827' };

export default OrderHistoryPage;
