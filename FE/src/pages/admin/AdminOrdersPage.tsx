import React, { useState } from 'react';
import { useOrders } from '../../hooks/useOrders';
import { formatCurrency, formatDate, getOrderStatusLabel, getOrderStatusColor } from '../../utils/helpers';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { Order, OrderStatus } from '../../types';

const ALL_STATUSES: OrderStatus[] = ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'];

const AdminOrdersPage: React.FC = () => {
  const { orders, updateOrderStatus } = useOrders();
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filtered = filterStatus === 'all' ? orders : orders.filter((o) => o.status === filterStatus);

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>Quản lý đơn hàng</h1>
        <p style={{ color: '#6b7280', margin: '4px 0 0', fontSize: '13px' }}>
          {orders.length} đơn hàng tổng cộng
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setFilterStatus('all')}
          style={filterTabStyle(filterStatus === 'all')}
        >
          Tất cả ({orders.length})
        </button>
        {ALL_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            style={filterTabStyle(filterStatus === s)}
          >
            {getOrderStatusLabel(s)} ({orders.filter((o) => o.status === s).length})
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
              {['Mã đơn', 'Ngày đặt', 'Khách hàng', 'Sản phẩm', 'Tổng tiền', 'Trạng thái', 'Thao tác'].map((h) => (
                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '12px 14px', fontSize: '14px', fontWeight: 700 }}>#{order.id}</td>
                <td style={{ padding: '12px 14px', fontSize: '13px', color: '#6b7280' }}>
                  {formatDate(order.createdAt)}
                </td>
                <td style={{ padding: '12px 14px', fontSize: '13px' }}>
                  <div>{order.phone}</div>
                  <div style={{ color: '#6b7280', fontSize: '12px', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {order.address}
                  </div>
                </td>
                <td style={{ padding: '12px 14px', fontSize: '13px', color: '#374151' }}>
                  {order.items.length} sản phẩm
                </td>
                <td style={{ padding: '12px 14px', fontSize: '14px', fontWeight: 700, color: '#2563eb' }}>
                  {formatCurrency(order.total)}
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <Badge
                    bg={`${getOrderStatusColor(order.status)}22`}
                    color={getOrderStatusColor(order.status)}
                  >
                    {getOrderStatusLabel(order.status)}
                  </Badge>
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <Button size="sm" variant="outline" onClick={() => setSelectedOrder(order)}>
                    Chi tiết
                  </Button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
                  Không có đơn hàng nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Đơn hàng #${selectedOrder?.id}`}
        size="lg"
      >
        {selectedOrder && (
          <div>
            {/* Status */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                Cập nhật trạng thái
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {ALL_STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, s);
                      setSelectedOrder((prev) => prev ? { ...prev, status: s } : prev);
                    }}
                    style={{
                      padding: '6px 14px', borderRadius: '8px', border: '2px solid',
                      borderColor: selectedOrder.status === s ? getOrderStatusColor(s) : '#e5e7eb',
                      background: selectedOrder.status === s ? `${getOrderStatusColor(s)}15` : '#fff',
                      color: selectedOrder.status === s ? getOrderStatusColor(s) : '#6b7280',
                      fontWeight: selectedOrder.status === s ? 700 : 400,
                      cursor: 'pointer', fontSize: '13px',
                    }}
                  >
                    {getOrderStatusLabel(s)}
                  </button>
                ))}
              </div>
            </div>

            {/* Items */}
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: 700 }}>Sản phẩm</h4>
              {selectedOrder.items.map((item) => (
                <div key={item.productId} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: '#f9fafb', borderRadius: '8px', marginBottom: '8px' }}>
                  <img src={item.image} alt={item.productName} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>{item.productName}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{formatCurrency(item.price)} × {item.quantity}</div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>{formatCurrency(item.price * item.quantity)}</div>
                </div>
              ))}
            </div>

            {/* Address */}
            <div style={{ background: '#f9fafb', borderRadius: '8px', padding: '14px', marginBottom: '14px' }}>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>Thông tin giao hàng</div>
              <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '4px' }}>📍 {selectedOrder.address}</div>
              <div style={{ fontSize: '13px', marginTop: '4px' }}>📞 {selectedOrder.phone}</div>
              {selectedOrder.note && <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>📝 {selectedOrder.note}</div>}
            </div>

            {/* Total */}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px', background: '#eff6ff', borderRadius: '8px', fontSize: '17px', fontWeight: 700 }}>
              <span>Tổng cộng</span>
              <span style={{ color: '#2563eb' }}>{formatCurrency(selectedOrder.total)}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

const filterTabStyle = (active: boolean): React.CSSProperties => ({
  padding: '7px 14px', borderRadius: '8px',
  border: `2px solid ${active ? '#2563eb' : '#e5e7eb'}`,
  background: active ? '#eff6ff' : '#fff',
  color: active ? '#2563eb' : '#6b7280',
  fontWeight: active ? 700 : 400,
  cursor: 'pointer', fontSize: '13px',
});

export default AdminOrdersPage;
