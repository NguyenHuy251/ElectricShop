import React, { useState } from 'react';
import { EnvironmentOutlined, FileTextOutlined, PhoneOutlined } from '@ant-design/icons';
import { useOrders } from '../../hooks/useOrders';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency, formatDate, getOrderStatusLabel, getOrderStatusColor } from '../../utils/helpers';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { Order, OrderStatus } from '../../types';
import '../../assets/styles/pages/admin-pages.css';

const ALL_STATUSES: OrderStatus[] = ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'];

const AdminOrdersPage: React.FC = () => {
  const { currentUser } = useAuth();

  const { orders, updateOrderStatus, loading } = useOrders();
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filtered = filterStatus === 'all' ? orders : orders.filter((o) => o.status === filterStatus);

  return (
    <div>
      <div className="dashboard-title-wrap">
        <h1 className="admin-page-title">Quản lý đơn hàng</h1>
        <p className="admin-page-subtitle">
          {orders.length} đơn hàng tổng cộng
        </p>
      </div>

      <div className="admin-orders-filter-row">
        <button
          onClick={() => setFilterStatus('all')}
          style={filterTabStyle(filterStatus === 'all')}
          className={`admin-orders-filter-btn${filterStatus === 'all' ? ' active' : ''}`}
        >
          Tất cả ({orders.length})
        </button>
        {ALL_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            style={filterTabStyle(filterStatus === s)}
            className={`admin-orders-filter-btn${filterStatus === s ? ' active' : ''}`}
          >
            {getOrderStatusLabel(s)} ({orders.filter((o) => o.status === s).length})
          </button>
        ))}
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr className="admin-table-head-row">
              {['Mã đơn', 'Ngày đặt', 'Khách hàng', 'Sản phẩm', 'Tổng tiền', 'Người xác nhận', 'Trạng thái', 'Thao tác'].map((h) => (
                <th key={h} className="admin-table-th">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} className="admin-orders-empty">
                  Dang tai don hang...
                </td>
              </tr>
            )}
            {filtered.map((order) => {
              return (
                <tr key={order.id} className="admin-table-row">
                  <td className="admin-orders-id">#{order.id}</td>
                  <td className="admin-orders-date">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="admin-orders-customer">
                    <div>{order.phone}</div>
                    <div className="admin-orders-address-short">
                      {order.address}
                    </div>
                  </td>
                  <td className="admin-orders-items">
                    {order.items.length} sản phẩm
                  </td>
                  <td className="admin-orders-total">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="admin-orders-confirmed-by">
                    {order.status !== 'pending' ? (order.confirmedBy || '-') : '-'}
                  </td>
                  <td className="admin-orders-status">
                    <Badge
                      bg={`${getOrderStatusColor(order.status)}22`}
                      color={getOrderStatusColor(order.status)}
                    >
                      {getOrderStatusLabel(order.status)}
                    </Badge>
                  </td>
                  <td className="admin-orders-action">
                    <Button size="sm" variant="outline" onClick={() => setSelectedOrder(order)}>
                      Chi tiết
                    </Button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="admin-orders-empty">
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
            <div className="admin-orders-section">
              <div className="admin-orders-section-title">
                Cập nhật trạng thái
              </div>
              <div className="admin-orders-status-row">
                {ALL_STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={async () => {
                      await updateOrderStatus(selectedOrder.id, s, currentUser?.name || '');
                      setSelectedOrder((prev) => prev ? { ...prev, status: s, confirmedBy: currentUser?.name || prev.confirmedBy } : prev);
                    }}
                    style={statusButtonStyle(selectedOrder.status === s, s)}
                    className="admin-orders-status-btn"
                  >
                    {getOrderStatusLabel(s)}
                  </button>
                ))}
              </div>
            </div>

            <div className="admin-table-cell">
              <h4 className="admin-orders-items-title">Sản phẩm</h4>
              {selectedOrder.items.map((item) => (
                <div key={item.productId} className="admin-orders-item-card">
                  <img src={item.image} alt={item.productName} className="admin-orders-item-image" />
                  <div className="admin-orders-item-info">
                    <div className="admin-orders-item-name">{item.productName}</div>
                    <div className="admin-orders-item-meta">{formatCurrency(item.price)} × {item.quantity}</div>
                  </div>
                  <div className="admin-orders-item-total">{formatCurrency(item.price * item.quantity)}</div>
                </div>
              ))}
            </div>

            <div className="admin-orders-shipping">
              <div className="admin-orders-shipping-title">Thông tin giao hàng</div>
              <div className="admin-orders-shipping-line main"><EnvironmentOutlined className="admin-orders-icon" />{selectedOrder.address}</div>
              <div className="admin-orders-shipping-line"><PhoneOutlined className="admin-orders-icon" />{selectedOrder.phone}</div>
              {selectedOrder.note && <div className="admin-orders-shipping-note"><FileTextOutlined className="admin-orders-icon" />{selectedOrder.note}</div>}
            </div>

            <div className="admin-orders-summary">
              <span>Tổng cộng</span>
              <span className="admin-orders-summary-total">{formatCurrency(selectedOrder.total)}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

const filterTabStyle = (active: boolean): React.CSSProperties => ({
  fontWeight: active ? 700 : 400,
});

const statusButtonStyle = (active: boolean, status: OrderStatus): React.CSSProperties => ({
  borderColor: active ? getOrderStatusColor(status) : '#e5e7eb',
  background: active ? `${getOrderStatusColor(status)}15` : '#fff',
  color: active ? getOrderStatusColor(status) : '#6b7280',
  fontWeight: active ? 700 : 400,
});

export default AdminOrdersPage;
