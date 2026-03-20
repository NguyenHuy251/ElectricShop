import React from 'react';
import { useRecoilValue } from 'recoil';
import { productsAtom } from '../../recoil/atoms/productAtom';
import { useOrders } from '../../hooks/useOrders';
import { users } from '../../data/mockData';
import { formatCurrency, getOrderStatusLabel, getOrderStatusColor, formatDate } from '../../utils/helpers';

const StatCard: React.FC<{ icon: string; label: string; value: string; color: string }> = ({ icon, label, value, color }) => (
  <div
    style={{
      background: '#fff', borderRadius: '12px', padding: '20px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      display: 'flex', alignItems: 'center', gap: '16px',
    }}
  >
    <div
      style={{
        width: '52px', height: '52px', borderRadius: '12px',
        background: `${color}18`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '24px', flexShrink: 0,
      }}
    >
      {icon}
    </div>
    <div>
      <div style={{ fontSize: '24px', fontWeight: 800, color: '#111827' }}>{value}</div>
      <div style={{ fontSize: '13px', color: '#6b7280' }}>{label}</div>
    </div>
  </div>
);

const DashboardPage: React.FC = () => {
  const products = useRecoilValue(productsAtom);
  const { orders } = useOrders();

  const totalRevenue = orders
    .filter((o) => o.status === 'delivered')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter((o) => o.status === 'pending').length;

  const recentOrders = orders.slice(0, 5);

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: 0 }}>Dashboard</h1>
        <p style={{ color: '#6b7280', margin: '4px 0 0', fontSize: '14px' }}>
          Tổng quan hệ thống ElectricShop
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        <StatCard icon="💰" label="Doanh thu" value={formatCurrency(totalRevenue)} color="#10b981" />
        <StatCard icon="📦" label="Sản phẩm" value={String(products.length)} color="#2563eb" />
        <StatCard icon="🛒" label="Đơn hàng" value={String(orders.length)} color="#8b5cf6" />
        <StatCard icon="👥" label="Khách hàng" value={String(users.filter((u) => u.role === 'user').length)} color="#f59e0b" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px' }}>
        {/* Recent Orders */}
        <div style={{ background: '#fff', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700 }}>Đơn hàng gần đây</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f3f4f6' }}>
                {['Mã đơn', 'Ngày đặt', 'Tổng tiền', 'Trạng thái'].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: '8px 10px', textAlign: 'left',
                      fontSize: '12px', fontWeight: 700,
                      color: '#6b7280', textTransform: 'uppercase',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                  <td style={{ padding: '10px', fontSize: '14px', fontWeight: 600 }}>#{order.id}</td>
                  <td style={{ padding: '10px', fontSize: '13px', color: '#6b7280' }}>{formatDate(order.createdAt)}</td>
                  <td style={{ padding: '10px', fontSize: '14px', fontWeight: 600 }}>{formatCurrency(order.total)}</td>
                  <td style={{ padding: '10px' }}>
                    <span
                      style={{
                        padding: '3px 10px', borderRadius: '999px',
                        fontSize: '12px', fontWeight: 600,
                        background: `${getOrderStatusColor(order.status)}22`,
                        color: getOrderStatusColor(order.status),
                      }}
                    >
                      {getOrderStatusLabel(order.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700 }}>Trạng thái đơn hàng</h3>
            {[
              { status: 'pending', label: 'Chờ xác nhận' },
              { status: 'confirmed', label: 'Đã xác nhận' },
              { status: 'shipping', label: 'Đang giao' },
              { status: 'delivered', label: 'Đã giao' },
              { status: 'cancelled', label: 'Đã hủy' },
            ].map(({ status, label }) => {
              const count = orders.filter((o) => o.status === status).length;
              const pct = orders.length > 0 ? (count / orders.length) * 100 : 0;
              return (
                <div key={status} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', color: '#374151' }}>{label}</span>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>{count}</span>
                  </div>
                  <div style={{ height: '6px', background: '#f3f4f6', borderRadius: '999px' }}>
                    <div
                      style={{
                        height: '100%', borderRadius: '999px',
                        background: getOrderStatusColor(status),
                        width: `${pct}%`,
                        transition: 'width 0.3s',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ background: '#fff', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '16px', fontWeight: 700 }}>Đơn hàng chờ xử lý</h3>
            <div style={{ fontSize: '40px', fontWeight: 800, color: pendingOrders > 0 ? '#f59e0b' : '#10b981' }}>
              {pendingOrders}
            </div>
            <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
              {pendingOrders > 0 ? 'Đơn hàng cần xác nhận' : 'Tất cả đã được xử lý ✓'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
