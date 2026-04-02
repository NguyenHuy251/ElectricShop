import React, { useState } from 'react';
import { CloseOutlined, DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import Modal from '../../components/ui/Modal';
import { useAuth } from '../../hooks/useAuth';
import { formatDate, formatCurrency } from '../../utils/helpers';
import '../../assets/styles/pages/admin-pages.css';

export interface ImportReceiptItem {
  id: number;
  idSanPham: number;
  soLuong: number;
  giaNhap: number;
  tenSanPham: string;
}

export interface ImportReceipt {
  id: number;
  idNhaCungCap: number;
  tongTien: number;
  ngayNhap: string;
  tenNhaCungCap: string;
  items: ImportReceiptItem[];
}

// Mock data
const mockSuppliers = [
  { id: 1, tenNhaCungCap: 'Panasonic VN' },
  { id: 2, tenNhaCungCap: 'Philips VN' },
  { id: 3, tenNhaCungCap: 'Sunhouse' },
  { id: 4, tenNhaCungCap: 'Xiaomi' },
  { id: 5, tenNhaCungCap: 'Electrolux' },
];

const mockProducts = [
  { id: 1, tenSanPham: 'Quạt Panasonic 5 cánh' },
  { id: 2, tenSanPham: 'Nồi cơm Panasonic 1.8L' },
  { id: 3, tenSanPham: 'Máy xay Philips' },
  { id: 4, tenSanPham: 'Ấm Sunhouse' },
  { id: 5, tenSanPham: 'Máy hút bụi Electrolux' },
];

const initialReceipts: ImportReceipt[] = [
  {
    id: 1,
    idNhaCungCap: 1,
    tongTien: 50000000,
    ngayNhap: '2026-03-20',
    tenNhaCungCap: 'Panasonic VN',
    items: [
      { id: 1, idSanPham: 1, soLuong: 20, giaNhap: 1200000, tenSanPham: 'Quạt Panasonic 5 cánh' },
    ],
  },
  {
    id: 2,
    idNhaCungCap: 2,
    tongTien: 30000000,
    ngayNhap: '2026-03-18',
    tenNhaCungCap: 'Philips VN',
    items: [
      { id: 2, idSanPham: 2, soLuong: 15, giaNhap: 1000000, tenSanPham: 'Nồi cơm Panasonic 1.8L' },
    ],
  },
  {
    id: 3,
    idNhaCungCap: 3,
    tongTien: 20000000,
    ngayNhap: '2026-03-15',
    tenNhaCungCap: 'Sunhouse',
    items: [
      { id: 3, idSanPham: 3, soLuong: 10, giaNhap: 700000, tenSanPham: 'Máy xay Philips' },
    ],
  },
];

const AdminImportReceiptsPage: React.FC = () => {
  const { currentUser } = useAuth();

  const [receipts, setReceipts] = useState<ImportReceipt[]>(initialReceipts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<ImportReceipt | null>(null);
  const [formData, setFormData] = useState({
    idNhaCungCap: '',
    items: [{ idSanPham: '', soLuong: '', giaNhap: '' }],
  });

  const handleOpenModal = () => {
    setFormData({
      idNhaCungCap: '',
      items: [{ idSanPham: '', soLuong: '', giaNhap: '' }],
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleViewDetail = (receipt: ImportReceipt) => {
    setSelectedReceipt(receipt);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedReceipt(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index?: number
  ) => {
    const { name, value } = e.target;

    if (index !== undefined) {
      const newItems = [...formData.items];
      newItems[index] = { ...newItems[index], [name]: value };
      setFormData((prev) => ({
        ...prev,
        items: newItems,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { idSanPham: '', soLuong: '', giaNhap: '' }],
    }));
  };

  const handleRemoveItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.idNhaCungCap || formData.items.length === 0) {
      alert('Vui lòng chọn nhà cung cấp và thêm ít nhất một sản phẩm');
      return;
    }

    const supplier = mockSuppliers.find((s) => s.id === parseInt(formData.idNhaCungCap));
    if (!supplier) {
      alert('Nhà cung cấp không hợp lệ');
      return;
    }

    // Calculate total and create items
    let totalAmount = 0;
    const items: ImportReceiptItem[] = [];

    formData.items.forEach((item, index) => {
      if (!item.idSanPham || !item.soLuong || !item.giaNhap) {
        alert(`Vui lòng nhập đầy đủ thông tin sản phẩm thứ ${index + 1}`);
        return;
      }

      const product = mockProducts.find((p) => p.id === parseInt(item.idSanPham));
      if (!product) return;

      const itemTotal = parseInt(item.soLuong) * parseInt(item.giaNhap);
      totalAmount += itemTotal;

      items.push({
        id: Math.random(),
        idSanPham: parseInt(item.idSanPham),
        soLuong: parseInt(item.soLuong),
        giaNhap: parseInt(item.giaNhap),
        tenSanPham: product.tenSanPham,
      });
    });

    const newReceipt: ImportReceipt = {
      id: Math.max(...receipts.map((r) => r.id), 0) + 1,
      idNhaCungCap: parseInt(formData.idNhaCungCap),
      tongTien: totalAmount,
      ngayNhap: new Date().toISOString().split('T')[0],
      tenNhaCungCap: supplier.tenNhaCungCap,
      items,
    };

    setReceipts((prev) => [...prev, newReceipt]);
    handleCloseModal();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phiếu nhập này?')) {
      setReceipts((prev) => prev.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="admin-import-page">
      <div className="admin-page-header">
        <h1 className="admin-import-header-title">
          Quản lý Phiếu nhập hàng
        </h1>
        <button onClick={handleOpenModal} className="admin-import-create-btn">
          <PlusOutlined /> Tạo phiếu nhập
        </button>
      </div>

      <div className="admin-import-table-wrap">
        <table className="admin-table">
          <thead>
            <tr className="admin-import-head-row">
              <th className="admin-import-th">
                ID
              </th>
              <th className="admin-import-th">
                Nhà cung cấp
              </th>
              <th className="admin-import-th admin-import-th-right">
                Tổng tiền
              </th>
              <th className="admin-import-th">
                Ngày nhập
              </th>
              <th className="admin-import-th">
                Người thực hiện
              </th>
              <th className="admin-import-th admin-import-th-center">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {receipts.map((receipt) => {
              // Mock data for person who performed the import
              const employees = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C', 'Hoàng Tú D', 'Vũ Hải E'];
              const performedBy = employees[receipt.id % employees.length];

              return (
                <tr key={receipt.id} className="admin-import-row">
                  <td className="admin-import-cell admin-import-cell-strong">#{receipt.id}</td>
                  <td className="admin-import-cell">
                    {receipt.tenNhaCungCap}
                  </td>
                  <td className="admin-import-cell admin-import-cell-right admin-import-cell-strong">
                    {formatCurrency(receipt.tongTien)}
                  </td>
                  <td className="admin-import-cell admin-import-cell-muted">
                    {formatDate(receipt.ngayNhap)}
                  </td>
                  <td className="admin-import-cell admin-import-cell-muted">
                    {performedBy}
                  </td>
                  <td className="admin-import-cell admin-import-cell-center">
                    <div className="admin-import-actions">
                      <button onClick={() => handleViewDetail(receipt)} className="admin-import-action-btn view">
                        <EyeOutlined /> Xem chi tiết
                      </button>
                      <button onClick={() => handleDelete(receipt.id)} className="admin-import-action-btn delete">
                        <DeleteOutlined /> Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} size="lg">
        <div className="admin-import-modal-body">
          <h2 className="admin-import-modal-title">
            Tạo phiếu nhập hàng mới
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="admin-import-field">
              <label className="admin-import-label">
                Chọn nhà cung cấp <span className="admin-import-label-required">*</span>
              </label>
              <select
                name="idNhaCungCap"
                value={formData.idNhaCungCap}
                onChange={handleInputChange}
                className="admin-import-control"
              >
                <option value="">-- Chọn nhà cung cấp --</option>
                {mockSuppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.tenNhaCungCap}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-import-field">
              <label className="admin-import-label">
                Người thực hiện
              </label>
              <input
                value={currentUser?.name || currentUser?.username || 'Nhân viên phụ trách'}
                readOnly
                className="admin-import-input readonly"
              />
            </div>

            <div className="admin-import-items-box">
              <p className="admin-import-items-title">Sản phẩm nhập</p>

              {formData.items.map((item, index) => (
                <div key={index} className="admin-import-item-row">
                  <select
                    name="idSanPham"
                    value={item.idSanPham}
                    onChange={(e) => handleInputChange(e, index)}
                    className="admin-import-control"
                  >
                    <option value="">-- Chọn sản phẩm --</option>
                    {mockProducts.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.tenSanPham}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    name="soLuong"
                    value={item.soLuong}
                    onChange={(e) => handleInputChange(e, index)}
                    className="admin-import-input"
                    placeholder="Số lượng"
                    min="1"
                  />

                  <input
                    type="number"
                    name="giaNhap"
                    value={item.giaNhap}
                    onChange={(e) => handleInputChange(e, index)}
                    className="admin-import-input"
                    placeholder="Giá nhập"
                    min="0"
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    aria-label="Xóa sản phẩm"
                    title="Xóa sản phẩm"
                    className="admin-import-remove-item-btn"
                  >
                    <CloseOutlined />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddItem}
                className="admin-import-add-item-btn"
              >
                + Thêm sản phẩm
              </button>
            </div>

            <div className="admin-import-form-actions">
              <button type="button" onClick={handleCloseModal} className="admin-import-btn cancel">
                Hủy
              </button>
              <button type="submit" className="admin-import-btn primary">
                Tạo phiếu nhập
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Detail Modal */}
      {selectedReceipt && (
        <Modal isOpen={isDetailModalOpen} onClose={handleCloseDetailModal}>
          <div className="admin-import-modal-body">
            <h2 className="admin-import-modal-title">
              Chi tiết Phiếu nhập #{selectedReceipt.id}
            </h2>

            <div className="admin-import-summary">
              <div className="admin-import-summary-row">
                <span className="admin-import-summary-label">Nhà cung cấp:</span>
                <span className="admin-import-summary-value">{selectedReceipt.tenNhaCungCap}</span>
              </div>
              <div className="admin-import-summary-row">
                <span className="admin-import-summary-label">Ngày nhập:</span>
                <span className="admin-import-summary-value">
                  {formatDate(selectedReceipt.ngayNhap)}
                </span>
              </div>
              <div>
                <span className="admin-import-summary-label">Tổng tiền:</span>
                <span className="admin-import-summary-total">
                  {formatCurrency(selectedReceipt.tongTien)}
                </span>
              </div>
            </div>

            <p className="admin-import-detail-title">Chi tiết sản phẩm:</p>
            <div className="admin-import-detail-wrap">
              <table className="admin-table">
                <thead>
                  <tr className="admin-import-detail-head-row">
                    <th className="admin-import-detail-th">
                      Sản phẩm
                    </th>
                    <th className="admin-import-detail-th admin-import-detail-right">
                      Số lượng
                    </th>
                    <th className="admin-import-detail-th admin-import-detail-right">
                      Giá nhập
                    </th>
                    <th className="admin-import-detail-th admin-import-detail-right">
                      Thành tiền
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedReceipt.items.map((item) => (
                    <tr key={item.id} className="admin-import-detail-row">
                      <td className="admin-import-detail-td">
                        {item.tenSanPham}
                      </td>
                      <td className="admin-import-detail-td admin-import-detail-right">
                        {item.soLuong}
                      </td>
                      <td className="admin-import-detail-td admin-import-detail-right">
                        {formatCurrency(item.giaNhap)}
                      </td>
                      <td className="admin-import-detail-td admin-import-detail-right admin-import-detail-td-strong">
                        {formatCurrency(item.soLuong * item.giaNhap)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="admin-import-detail-close-row">
              <button onClick={handleCloseDetailModal} className="admin-import-btn primary">
                Đóng
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminImportReceiptsPage;
