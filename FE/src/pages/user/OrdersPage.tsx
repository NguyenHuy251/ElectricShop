import React, { useState } from 'react';
import { FileTextOutlined, InboxOutlined, PhoneOutlined } from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import { useOrders } from '../../hooks/useOrders';
import { formatCurrency, formatDate, getOrderStatusLabel } from '../../utils/helpers';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { Invoice, Order } from '../../types';
import { getInvoiceByOrder } from '../../services';
import '../../assets/styles/pages/user-pages.css';

const getOrderStatusClass = (status: Order['trangThai']) => `order-status order-status--${status}`;

const OrdersPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { userOrders, loading } = useOrders(currentUser?.id);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  if (loading) {
    return (
      <div className="orders-empty">
        <h2 className="orders-empty__title">Dang tai don hang...</h2>
      </div>
    );
  }

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
                <div className="orders-card__date">{formatDate(order.ngayDatHang)}</div>
              </div>
              <span className={getOrderStatusClass(order.trangThai)}>{getOrderStatusLabel(order.trangThai)}</span>
            </div>

            <div className="orders-card__preview">
              {order.chiTiet.map((item) => (
                <div key={item.idSanPham} className="orders-card__item">
                  <img
                    src={item.hinhAnh}
                    alt={item.tenSanPham}
                    className="orders-card__thumb"
                  />
                  <div>
                    <div className="orders-card__item-name">{item.tenSanPham}</div>
                    <div className="orders-card__item-qty">x{item.soLuong}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="orders-card__footer">
              <div className="orders-card__total">Tổng: {formatCurrency(order.tongTien)}</div>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  setSelectedOrder(order);
                  try {
                    const invoiceResponse = await getInvoiceByOrder(order.id);
                    setSelectedInvoice(invoiceResponse.data);
                  } catch {
                    setSelectedInvoice(null);
                  }
                }}
              >
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
                <div className="order-detail__value">{formatDate(selectedOrder.ngayDatHang)}</div>
              </div>
              <div>
                <div className="order-detail__label">Trạng thái</div>
                <span className={`${getOrderStatusClass(selectedOrder.trangThai)} order-detail__status`}>
                  {getOrderStatusLabel(selectedOrder.trangThai)}
                </span>
              </div>
              <div>
                <div className="order-detail__label">Thanh toán</div>
                <div className="order-detail__value">{selectedInvoice?.phuongThucThanhToan || 'Tien mat (COD)'}</div>
              </div>
              <div>
                <div className="order-detail__label">Địa chỉ giao hàng</div>
                <div className="order-detail__value">{selectedOrder.diaChi}</div>
              </div>
            </div>

            <h4 className="order-detail__section-title">Sản phẩm đặt mua</h4>
            <div className="order-detail__items">
              {selectedOrder.chiTiet.map((item) => (
                <div key={item.idSanPham} className="order-detail__item">
                  <img src={item.hinhAnh} alt={item.tenSanPham} className="order-detail__thumb" />
                  <div className="order-detail__item-body">
                    <div className="order-detail__item-name">{item.tenSanPham}</div>
                    <div className="order-detail__item-meta">
                      {formatCurrency(item.gia)} x {item.soLuong}
                    </div>
                  </div>
                  <div className="order-detail__item-total">
                    {formatCurrency(item.gia * item.soLuong)}
                  </div>
                </div>
              ))}
            </div>

            <div className="order-detail__summary">
              <div>
                <div className="order-detail__label">Địa chỉ giao hàng</div>
                <div className="order-detail__value">{selectedOrder.diaChi}</div>
              </div>
              <div>
                <div className="order-detail__label">Số điện thoại</div>
                <div className="order-detail__value">
                  <PhoneOutlined className="order-detail__note-icon" />{selectedOrder.soDienThoai}
                </div>
              </div>
              <div>
                <div className="order-detail__label">Ghi chú</div>
                <div className="order-detail__value">{selectedOrder.ghiChu || 'Không có'}</div>
              </div>
            </div>

            <div className="order-detail__total-row">
              <span className="order-detail__total-label">Tổng cộng</span>
              <span className="order-detail__total-value">{formatCurrency(selectedOrder.tongTien)}</span>
            </div>

            {selectedInvoice && (
              <div className="order-detail__summary">
                <div>
                  <div className="order-detail__label">Ma hoa don</div>
                  <div className="order-detail__value">{selectedInvoice.maHoaDon}</div>
                </div>
                <div>
                  <div className="order-detail__label">Ma don hang</div>
                  <div className="order-detail__value">{selectedInvoice.maDonHang}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrdersPage;