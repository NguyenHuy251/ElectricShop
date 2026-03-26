import React, { useState } from 'react';
import { DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import Modal from '../../components/ui/Modal';
import { formatDate, formatCurrency } from '../../utils/helpers';

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
    <div style={{ padding: '24px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: '#111827' }}>
          Quản lý Phiếu nhập hàng
        </h1>
        <button
          onClick={handleOpenModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          <PlusOutlined /> Tạo phiếu nhập
        </button>
      </div>

      <div style={{ overflowX: 'auto', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb', background: '#f9fafb' }}>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>
                ID
              </th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>
                Nhà cung cấp
              </th>
              <th style={{ padding: '16px', textAlign: 'right', fontWeight: 600, color: '#475569' }}>
                Tổng tiền
              </th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>
                Ngày nhập
              </th>
              <th style={{ padding: '16px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {receipts.map((receipt) => (
              <tr key={receipt.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '16px', color: '#111827', fontWeight: 600 }}>#{receipt.id}</td>
                <td style={{ padding: '16px', color: '#111827' }}>
                  {receipt.tenNhaCungCap}
                </td>
                <td style={{ padding: '16px', color: '#111827', fontWeight: 600, textAlign: 'right' }}>
                  {formatCurrency(receipt.tongTien)}
                </td>
                <td style={{ padding: '16px', color: '#475569' }}>
                  {formatDate(receipt.ngayNhap)}
                </td>
                <td
                  style={{
                    padding: '16px',
                    textAlign: 'center',
                    display: 'flex',
                    gap: '8px',
                    justifyContent: 'center',
                  }}
                >
                  <button
                    onClick={() => handleViewDetail(receipt)}
                    style={{
                      padding: '6px 12px',
                      background: '#dbeafe',
                      color: '#0369a1',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontWeight: 600,
                    }}
                  >
                    <EyeOutlined /> Xem chi tiết
                  </button>
                  <button
                    onClick={() => handleDelete(receipt.id)}
                    style={{
                      padding: '6px 12px',
                      background: '#fee2e2',
                      color: '#dc2626',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontWeight: 600,
                    }}
                  >
                    <DeleteOutlined /> Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div style={{ padding: '24px' }}>
          <h2 style={{ margin: '0 0 20px', fontSize: '20px', fontWeight: 700, color: '#111827' }}>
            Tạo phiếu nhập hàng mới
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#111827' }}>
                Chọn nhà cung cấp <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <select
                name="idNhaCungCap"
                value={formData.idNhaCungCap}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                }}
              >
                <option value="">-- Chọn nhà cung cấp --</option>
                {mockSuppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.tenNhaCungCap}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '20px', padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
              <p style={{ margin: '0 0 16px', fontWeight: 600, color: '#111827' }}>Sản phẩm nhập</p>

              {formData.items.map((item, index) => (
                <div key={index} style={{ marginBottom: '16px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '12px', alignItems: 'end' }}>
                  <select
                    name="idSanPham"
                    value={item.idSanPham}
                    onChange={(e) => handleInputChange(e, index)}
                    style={{
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      cursor: 'pointer',
                    }}
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
                    style={{
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                    }}
                    placeholder="Số lượng"
                    min="1"
                  />

                  <input
                    type="number"
                    name="giaNhap"
                    value={item.giaNhap}
                    onChange={(e) => handleInputChange(e, index)}
                    style={{
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                    }}
                    placeholder="Giá nhập"
                    min="0"
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    style={{
                      padding: '10px 16px',
                      background: '#fee2e2',
                      color: '#dc2626',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    Xóa
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddItem}
                style={{
                  padding: '8px 16px',
                  background: '#dbeafe',
                  color: '#0369a1',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  marginTop: '8px',
                }}
              >
                + Thêm sản phẩm
              </button>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={handleCloseModal}
                style={{
                  padding: '10px 20px',
                  background: '#e5e7eb',
                  color: '#111827',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Hủy
              </button>
              <button
                type="submit"
                style={{
                  padding: '10px 20px',
                  background: '#2563eb',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Tạo phiếu nhập
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Detail Modal */}
      {selectedReceipt && (
        <Modal isOpen={isDetailModalOpen} onClose={handleCloseDetailModal}>
          <div style={{ padding: '24px', maxHeight: '80vh', overflowY: 'auto' }}>
            <h2 style={{ margin: '0 0 20px', fontSize: '20px', fontWeight: 700, color: '#111827' }}>
              Chi tiết Phiếu nhập #{selectedReceipt.id}
            </h2>

            <div style={{ marginBottom: '20px', padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
              <div style={{ marginBottom: '12px' }}>
                <span style={{ fontWeight: 600, color: '#475569' }}>Nhà cung cấp:</span>
                <span style={{ marginLeft: '12px', color: '#111827' }}>{selectedReceipt.tenNhaCungCap}</span>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <span style={{ fontWeight: 600, color: '#475569' }}>Ngày nhập:</span>
                <span style={{ marginLeft: '12px', color: '#111827' }}>
                  {formatDate(selectedReceipt.ngayNhap)}
                </span>
              </div>
              <div>
                <span style={{ fontWeight: 600, color: '#475569' }}>Tổng tiền:</span>
                <span
                  style={{ marginLeft: '12px', color: '#2563eb', fontWeight: 700, fontSize: '18px' }}
                >
                  {formatCurrency(selectedReceipt.tongTien)}
                </span>
              </div>
            </div>

            <p style={{ fontWeight: 600, color: '#111827', marginBottom: '12px' }}>Chi tiết sản phẩm:</p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
                    <th style={{ padding: '12px ', textAlign: 'left', fontWeight: 600, color: '#475569', fontSize: '14px' }}>
                      Sản phẩm
                    </th>
                    <th style={{ padding: '12px', textAlign: 'right', fontWeight: 600, color: '#475569', fontSize: '14px' }}>
                      Số lượng
                    </th>
                    <th style={{ padding: '12px', textAlign: 'right', fontWeight: 600, color: '#475569', fontSize: '14px' }}>
                      Giá nhập
                    </th>
                    <th style={{ padding: '12px', textAlign: 'right', fontWeight: 600, color: '#475569', fontSize: '14px' }}>
                      Thành tiền
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedReceipt.items.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '12px', color: '#111827', fontSize: '14px' }}>
                        {item.tenSanPham}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right', color: '#111827', fontSize: '14px' }}>
                        {item.soLuong}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right', color: '#111827', fontSize: '14px' }}>
                        {formatCurrency(item.giaNhap)}
                      </td>
                      <td
                        style={{ padding: '12px', textAlign: 'right', color: '#111827', fontWeight: 600, fontSize: '14px' }}
                      >
                        {formatCurrency(item.soLuong * item.giaNhap)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button
                onClick={handleCloseDetailModal}
                style={{
                  padding: '10px 20px',
                  background: '#2563eb',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
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
