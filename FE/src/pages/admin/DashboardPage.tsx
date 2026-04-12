import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { AppstoreOutlined, DollarOutlined, ShoppingCartOutlined, TeamOutlined } from '@ant-design/icons';
import { productsAtom } from '../../recoil/atoms/productAtom';
import { useOrders } from '../../hooks/useOrders';
import { formatCurrency, getOrderStatusLabel, formatDate } from '../../utils/helpers';
import { getReportSummary, getTopProducts } from '../../services';
import '../../assets/styles/pages/admin-pages.css';

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; color: string }> = ({ icon, label, value, color }) => (
  <div className="dashboard-stat-card">
    <div
      className={`dashboard-stat-icon ${
        color === '#10b981'
          ? 'admin-dashboard-icon-green'
          : color === '#2563eb'
            ? 'admin-dashboard-icon-blue'
            : color === '#8b5cf6'
              ? 'admin-dashboard-icon-purple'
              : 'admin-dashboard-icon-amber'
      }`}
    >
      {icon}
    </div>
    <div>
      <div className="dashboard-stat-value">{value}</div>
      <div className="dashboard-stat-label">{label}</div>
    </div>
  </div>
);

const DashboardPage: React.FC = () => {
  const products = useRecoilValue(productsAtom);
  const { orders } = useOrders();
  const [reportSummary, setReportSummary] = useState({
    tongDonHang: 0,
    tongDoanhThu: 0,
    tongKhachHang: 0,
    tongSanPhamBan: 0,
  });
  const [topProducts, setTopProducts] = useState<Array<{ idSanPham: number; tenSanPham: string; soLuongBan: number; doanhThu: number }>>([]);

  useEffect(() => {
    let isMounted = true;

    const loadReports = async () => {
      try {
        const [summaryResponse, topProductsResponse] = await Promise.all([
          getReportSummary(),
          getTopProducts({ topN: 5 }),
        ]);

        if (isMounted) {
          setReportSummary(summaryResponse.data);
          setTopProducts(topProductsResponse.data);
        }
      } catch (error) {
        console.error('Không thể tải báo cáo:', error);
      }
    };

    void loadReports();

    return () => {
      isMounted = false;
    };
  }, []);

  const pendingOrders = orders.filter((o) => o.trangThai === 'pending').length;

  const recentOrders = orders.slice(0, 5);

  return (
    <div>
      <div className="dashboard-title-wrap">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">
          Tổng quan hệ thống ElectricShop
        </p>
      </div>

      <div className="dashboard-stats-grid">
        <StatCard icon={<DollarOutlined />} label="Doanh thu" value={formatCurrency(reportSummary.tongDoanhThu)} color="#10b981" />
        <StatCard icon={<AppstoreOutlined />} label="Sản phẩm" value={String(products.length)} color="#2563eb" />
        <StatCard icon={<ShoppingCartOutlined />} label="Đơn hàng" value={String(reportSummary.tongDonHang)} color="#8b5cf6" />
        <StatCard icon={<TeamOutlined />} label="Khách hàng" value={String(reportSummary.tongKhachHang)} color="#f59e0b" />
      </div>

      <div className="dashboard-content-grid">
        <div className="dashboard-card">
          <h3 className="dashboard-card-title">Đơn hàng gần đây</h3>
          <table className="admin-table">
            <thead>
              <tr className="dashboard-table-head-row">
                {['Mã đơn', 'Ngày đặt', 'Tổng tiền', 'Người xác nhận', 'Trạng thái'].map((h) => (
                  <th key={h} className="dashboard-table-th">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => {
                return (
                  <tr key={order.id} className="dashboard-table-row">
                    <td className="dashboard-table-cell dashboard-cell-id">#{order.id}</td>
                    <td className="dashboard-cell-muted">{formatDate(order.ngayDatHang)}</td>
                    <td className="dashboard-table-cell dashboard-cell-total">{formatCurrency(order.tongTien)}</td>
                    <td className="dashboard-cell-muted">
                      {order.trangThai !== 'pending' ? (order.tenNguoiXacNhan || '-') : '-'}
                    </td>
                    <td className="dashboard-table-cell">
                      <span
                        className={`dashboard-status-badge ${order.trangThai}`}
                      >
                        {getOrderStatusLabel(order.trangThai)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="dashboard-side-column">
          <div className="dashboard-card">
            <h3 className="dashboard-card-title">Trạng thái đơn hàng</h3>
            {[
              { status: 'pending', label: 'Chờ xác nhận' },
              { status: 'confirmed', label: 'Đã xác nhận' },
              { status: 'shipping', label: 'Đang giao' },
              { status: 'delivered', label: 'Đã giao' },
              { status: 'cancelled', label: 'Đã hủy' },
            ].map(({ status, label }) => {
              const count = orders.filter((o) => o.trangThai === status).length;
              const pct = orders.length > 0 ? (count / orders.length) * 100 : 0;
              return (
                <div key={status} className="dashboard-progress-item">
                  <div className="dashboard-progress-head">
                    <span className="dashboard-progress-label">{label}</span>
                    <span className="dashboard-progress-count">{count}</span>
                  </div>
                  <progress
                    className={`dashboard-progress-native ${status}`}
                    value={pct}
                    max={100}
                  />
                </div>
              );
            })}
          </div>

          <div className="dashboard-card">
            <h3 className="dashboard-card-title-sm">Sản phẩm bán chạy</h3>
            {topProducts.length > 0 ? (
              <div className="dashboard-top-products">
                {topProducts.map((product, index) => (
                  <div key={product.idSanPham} className="dashboard-top-product-row">
                    <span className="dashboard-top-product-rank">#{index + 1}</span>
                    <div className="dashboard-top-product-info">
                      <div className="dashboard-top-product-name">{product.tenSanPham}</div>
                      <div className="dashboard-top-product-meta">
                        {product.soLuongBan} sản phẩm • {formatCurrency(product.doanhThu)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="dashboard-pending-label">Chưa có dữ liệu bán chạy</div>
            )}
          </div>

          <div className="dashboard-card">
            <h3 className="dashboard-card-title-sm">Đơn hàng chờ xử lý</h3>
            <div className={`dashboard-pending-value ${pendingOrders > 0 ? 'admin-stat-amber' : 'admin-stat-green'}`}>
              {pendingOrders}
            </div>
            <div className="dashboard-pending-label">
              {pendingOrders > 0 ? 'Đơn hàng cần xác nhận' : 'Tất cả đã được xử lý ✓'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
