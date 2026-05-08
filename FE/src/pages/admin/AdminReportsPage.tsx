import React, { useEffect, useMemo, useState } from 'react';
import { CalendarOutlined, BarChartOutlined, ReloadOutlined, TrophyOutlined } from '@ant-design/icons';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { getReportSummary, getRevenueByDate, getTopProducts, createSnapshot, getSnapshots } from '../../services';
import { useAuth } from '../../hooks/useAuth';
import '../../assets/styles/pages/admin-pages.css';

type ReportSummary = {
  tongDonHang: number;
  tongDoanhThu: number;
  tongKhachHang: number;
  tongSanPhamBan: number;
};

type RevenueRow = {
  ngay: string;
  doanhThu: number;
  soDonHang: number;
};

type TopProductRow = {
  idSanPham: number;
  tenSanPham: string;
  soLuongBan: number;
  doanhThu: number;
};

const initialSummary: ReportSummary = {
  tongDonHang: 0,
  tongDoanhThu: 0,
  tongKhachHang: 0,
  tongSanPhamBan: 0,
};

const AdminReportsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [summary, setSummary] = useState<ReportSummary>(initialSummary);
  const [revenueRows, setRevenueRows] = useState<RevenueRow[]>([]);
  const [topProducts, setTopProducts] = useState<TopProductRow[]>([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [snapshots, setSnapshots] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  const loadReports = async (filters?: { fromDate?: string; toDate?: string }) => {
    setLoading(true);
    try {
      const params = {
        fromDate: filters?.fromDate ?? fromDate ?? undefined,
        toDate: filters?.toDate ?? toDate ?? undefined,
      };
      const [summaryResponse, revenueResponse, topProductsResponse] = await Promise.all([
        getReportSummary(params),
        getRevenueByDate(params),
        getTopProducts({ ...params, topN: 8 }),
      ]);

      setSummary(summaryResponse.data);
      setRevenueRows(revenueResponse.data);
      setTopProducts(topProductsResponse.data);
    } catch (error) {
      console.error('Không thể tải báo cáo thống kê:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSnapshots = async () => {
    try {
      const resp = await getSnapshots({ topN: 50 });
      setSnapshots(resp.data || []);
    } catch (err) {
      console.error('Không thể tải danh sách báo cáo:', err);
    }
  };

  const handleSaveSnapshot = async () => {
    setSaving(true);
    try {
      const payload = {
        tuNgay: fromDate || new Date().toISOString().slice(0, 10),
        denNgay: toDate || new Date().toISOString().slice(0, 10),
        tongSoHoaDonBan: summary.tongDonHang,
        tongSoHoaDonNhap: 0,
        tongDoanhThuBan: summary.tongDoanhThu,
        tongChiPhiNhap: 0,
        tongDoanhThu: summary.tongDoanhThu,
        idNhanVien: currentUser?.id ?? null,
      };

      const res = await createSnapshot(payload);
      if (res?.data?.id) {
        void loadSnapshots();
      }
    } catch (err) {
      console.error('Lưu báo cáo thất bại', err);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    void loadReports();
    void loadSnapshots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = async () => {
    setFromDate('');
    setToDate('');
    await Promise.all([
      loadReports({ fromDate: undefined, toDate: undefined }),
      loadSnapshots(),
    ]);
  };

  const peakRevenue = useMemo(() => Math.max(...revenueRows.map((row) => row.doanhThu), 1), [revenueRows]);
  const peakSold = useMemo(() => Math.max(...topProducts.map((row) => row.soLuongBan), 1), [topProducts]);

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Báo cáo thống kê</h1>
          <p className="admin-page-subtitle">Tổng quan doanh thu, đơn hàng và sản phẩm bán chạy</p>
        </div>
        <button onClick={() => void handleRefresh()} className="admin-report-refresh-btn" disabled={loading || saving}>
          <ReloadOutlined /> {loading ? 'Đang tải...' : 'Làm mới'}
        </button>
      </div>

      <div style={{ marginTop: 16 }}>
        <div className="dashboard-card admin-report-history-card">
          <h3 className="dashboard-card-title-sm">Lịch sử báo cáo</h3>
          {snapshots.length > 0 ? (
            <div className="admin-report-table-wrap">
              <table className="admin-report-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Từ ngày</th>
                    <th>Đến ngày</th>
                    <th>Số HĐ bán</th>
                    <th>Số HĐ nhập</th>
                    <th>Doanh thu bán</th>
                    <th>Chi phí nhập</th>
                    <th>Tổng doanh thu</th>
                    <th>Nhân viên</th>
                    <th>Ngày tạo</th>
                  </tr>
                </thead>
                <tbody>
                  {snapshots.map((s, idx) => (
                    <tr key={s.id}>
                      <td>{idx + 1}</td>
                      <td>{s.tuNgay ? formatDate(s.tuNgay) : '-'}</td>
                      <td>{s.denNgay ? formatDate(s.denNgay) : '-'}</td>
                      <td>{s.tongSoHoaDonBan ?? 0}</td>
                      <td>{s.tongSoHoaDonNhap ?? 0}</td>
                      <td>{formatCurrency(s.tongDoanhThuBan ?? 0)}</td>
                      <td>{formatCurrency(s.tongChiPhiNhap ?? 0)}</td>
                      <td>{formatCurrency(s.tongDoanhThu ?? 0)}</td>
                      <td>{s.tenNhanVien || s.idNhanVien || '-'}</td>
                      <td>{s.ngayTao ? formatDate(s.ngayTao) : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="admin-empty-state">Chưa có báo cáo lưu trữ</div>
          )}
        </div>
      </div>

      <div className="admin-report-filter-card">
        <div className="admin-report-filter-head">
          <div>
            <h2 className="admin-report-filter-title"><CalendarOutlined /> Bộ lọc thời gian</h2>
            <p className="admin-report-filter-subtitle">Chọn khoảng ngày để xem số liệu tương ứng</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => void handleRefresh()} className="admin-report-apply-btn" disabled={loading || saving}>
              <BarChartOutlined /> Xem báo cáo
            </button>
            <button onClick={() => void handleSaveSnapshot()} disabled={saving || loading} className="admin-report-apply-btn">
              <CalendarOutlined /> {saving ? 'Đang lưu...' : 'Lưu báo cáo'}
            </button>
          </div>
        </div>

        <div className="admin-report-filter-grid">
          <div>
            <label className="admin-form-label">Từ ngày</label>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="admin-form-input" />
          </div>
          <div>
            <label className="admin-form-label">Đến ngày</label>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="admin-form-input" />
          </div>
        </div>
      </div>

      <div className="dashboard-stats-grid admin-report-stats-grid">
        <div className="admin-report-stat-card">
          <div className="admin-report-stat-label">Doanh thu</div>
          <div className="admin-report-stat-value">{formatCurrency(summary.tongDoanhThu)}</div>
        </div>
        <div className="admin-report-stat-card">
          <div className="admin-report-stat-label">Đơn hàng</div>
          <div className="admin-report-stat-value">{summary.tongDonHang}</div>
        </div>
        <div className="admin-report-stat-card">
          <div className="admin-report-stat-label">Khách hàng</div>
          <div className="admin-report-stat-value">{summary.tongKhachHang}</div>
        </div>
        <div className="admin-report-stat-card">
          <div className="admin-report-stat-label">Sản phẩm đã bán</div>
          <div className="admin-report-stat-value">{summary.tongSanPhamBan}</div>
        </div>
      </div>

      <div className="admin-report-layout">
        <div className="dashboard-card admin-report-panel">
          <h3 className="dashboard-card-title">Doanh thu theo ngày</h3>
          {revenueRows.length > 0 ? (
            <div className="admin-report-bars">
              {revenueRows.map((row) => (
                <div key={formatDate(row.ngay)} className="admin-report-bar-row">
                  <div className="admin-report-bar-head">
                    <span>{formatDate(row.ngay)}</span>
                    <strong>{formatCurrency(row.doanhThu)}</strong>
                  </div>
                  <div className="admin-report-bar-track">
                    <div className="admin-report-bar-fill" style={{ width: `${(row.doanhThu / peakRevenue) * 100}%` }} />
                  </div>
                  <div className="admin-report-bar-meta">{row.soDonHang} đơn hàng</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="admin-empty-state">Chưa có dữ liệu doanh thu trong khoảng thời gian đã chọn</div>
          )}
        </div>

        <div className="dashboard-card admin-report-panel">
          <div className="dashboard-card-head-row">
            <div>
              <h3 className="dashboard-card-title-sm">Sản phẩm bán chạy</h3>
              <p className="admin-report-top-subtitle"><TrophyOutlined /> Theo số lượng bán ra</p>
            </div>
          </div>

          {topProducts.length > 0 ? (
            <div className="admin-report-top-list">
              {topProducts.map((product, index) => (
                <div key={product.idSanPham} className="admin-report-top-card">
                  <div className="admin-report-top-rank">#{index + 1}</div>
                  <div className="admin-report-top-body">
                    <div className="admin-report-top-head">
                      <div>
                        <div className="admin-report-top-name">{product.tenSanPham}</div>
                        <div className="admin-report-top-meta">{product.soLuongBan} sản phẩm</div>
                      </div>
                      <div className="admin-report-top-revenue">{formatCurrency(product.doanhThu)}</div>
                    </div>
                    <div className="admin-report-top-track">
                      <div className="admin-report-top-fill" style={{ width: `${(product.soLuongBan / peakSold) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="admin-empty-state">Chưa có dữ liệu sản phẩm bán chạy</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReportsPage;