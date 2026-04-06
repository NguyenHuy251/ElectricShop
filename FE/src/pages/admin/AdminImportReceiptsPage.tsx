import React, { useEffect, useMemo, useState } from 'react';
import { CloseOutlined, DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import Modal from '../../components/ui/Modal';
import { useAuth } from '../../hooks/useAuth';
import { useProducts } from '../../hooks/useProducts';
import {
  createImportReceipt,
  deleteImportReceipt,
  getImportReceiptById,
  getImportReceipts,
  getSuppliers,
} from '../../services';
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
  idNhanVienLap: number | null;
  tongTien: number;
  ngayNhap: string;
  tenNhaCungCap: string;
  tenNhanVienLap: string | null;
  items: ImportReceiptItem[];
}

const AdminImportReceiptsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { products } = useProducts();

  const [receipts, setReceipts] = useState<ImportReceipt[]>([]);
  const [suppliers, setSuppliers] = useState<Array<{ id: number; tenNhaCungCap: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<ImportReceipt | null>(null);
  const [formData, setFormData] = useState({
    idNhaCungCap: '',
    items: [{ idSanPham: '', soLuong: '', giaNhap: '' }],
  });

  const productOptions = useMemo(
    () => products.map((product) => ({ id: product.id, tenSanPham: product.name })),
    [products],
  );

  const loadData = async () => {
    try {
      const [receiptResponse, supplierResponse] = await Promise.all([getImportReceipts(), getSuppliers()]);
      setReceipts(
        receiptResponse.data.map((receipt) => ({
          ...receipt,
          items: [],
        })),
      );
      setSuppliers(supplierResponse.data);
    } catch (_error: unknown) {
      alert('Khong the tai du lieu phieu nhap');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

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

  const handleViewDetail = async (receipt: ImportReceipt) => {
    try {
      const response = await getImportReceiptById(receipt.id);
      setSelectedReceipt({
        ...response.data.receipt,
        items: response.data.items,
      });
      setIsDetailModalOpen(true);
    } catch (_error: unknown) {
      alert('Khong the tai chi tiet phieu nhap');
    }
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedReceipt(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index?: number,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.idNhaCungCap || formData.items.length === 0) {
      alert('Vui long chon nha cung cap va them it nhat mot san pham');
      return;
    }

    const supplier = suppliers.find((s) => s.id === parseInt(formData.idNhaCungCap, 10));
    if (!supplier) {
      alert('Nha cung cap khong hop le');
      return;
    }

    const payloadItems: Array<{ idSanPham: number; soLuong: number; giaNhap: number }> = [];

    for (let index = 0; index < formData.items.length; index += 1) {
      const item = formData.items[index];
      if (!item.idSanPham || !item.soLuong || !item.giaNhap) {
        alert(`Vui long nhap day du thong tin san pham thu ${index + 1}`);
        return;
      }

      payloadItems.push({
        idSanPham: parseInt(item.idSanPham, 10),
        soLuong: parseInt(item.soLuong, 10),
        giaNhap: parseInt(item.giaNhap, 10),
      });
    }

    try {
      const response = await createImportReceipt({
        idNhaCungCap: parseInt(formData.idNhaCungCap, 10),
        items: payloadItems,
      });

      setReceipts((prev) => [
        {
          ...response.data.receipt,
          items: response.data.items,
        },
        ...prev,
      ]);
      handleCloseModal();
    } catch (_error: unknown) {
      alert('Khong the tao phieu nhap');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Ban co chac chan muon xoa phieu nhap nay?')) {
      return;
    }

    try {
      await deleteImportReceipt(id);
      setReceipts((prev) => prev.filter((r) => r.id !== id));
    } catch (_error: unknown) {
      alert('Khong the xoa phieu nhap');
    }
  };

  return (
    <div className="admin-import-page">
      <div className="admin-page-header">
        <h1 className="admin-import-header-title">Quan ly Phieu nhap hang</h1>
        <button onClick={handleOpenModal} className="admin-import-create-btn">
          <PlusOutlined /> Tao phieu nhap
        </button>
      </div>

      <div className="admin-import-table-wrap">
        <table className="admin-table">
          <thead>
            <tr className="admin-import-head-row">
              <th className="admin-import-th">ID</th>
              <th className="admin-import-th">Nha cung cap</th>
              <th className="admin-import-th admin-import-th-right">Tong tien</th>
              <th className="admin-import-th">Ngay nhap</th>
              <th className="admin-import-th">Nguoi thuc hien</th>
              <th className="admin-import-th admin-import-th-center">Hanh dong</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6} className="admin-empty-state">Dang tai du lieu phieu nhap...</td>
              </tr>
            )}
            {!isLoading && receipts.map((receipt) => (
              <tr key={receipt.id} className="admin-import-row">
                <td className="admin-import-cell admin-import-cell-strong">#{receipt.id}</td>
                <td className="admin-import-cell">{receipt.tenNhaCungCap}</td>
                <td className="admin-import-cell admin-import-cell-right admin-import-cell-strong">
                  {formatCurrency(receipt.tongTien)}
                </td>
                <td className="admin-import-cell admin-import-cell-muted">{formatDate(receipt.ngayNhap)}</td>
                <td className="admin-import-cell admin-import-cell-muted">{receipt.tenNhanVienLap || '-'}</td>
                <td className="admin-import-cell admin-import-cell-center">
                  <div className="admin-import-actions">
                    <button onClick={() => void handleViewDetail(receipt)} className="admin-import-action-btn view">
                      <EyeOutlined /> Xem chi tiet
                    </button>
                    <button onClick={() => void handleDelete(receipt.id)} className="admin-import-action-btn delete">
                      <DeleteOutlined /> Xoa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!isLoading && receipts.length === 0 && (
              <tr>
                <td colSpan={6} className="admin-empty-state">Chua co phieu nhap nao</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} size="lg">
        <div className="admin-import-modal-body">
          <h2 className="admin-import-modal-title">Tao phieu nhap hang moi</h2>

          <form onSubmit={handleSubmit}>
            <div className="admin-import-field">
              <label className="admin-import-label">Chon nha cung cap <span className="admin-import-label-required">*</span></label>
              <select
                name="idNhaCungCap"
                value={formData.idNhaCungCap}
                onChange={handleInputChange}
                className="admin-import-control"
              >
                <option value="">-- Chon nha cung cap --</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>{supplier.tenNhaCungCap}</option>
                ))}
              </select>
            </div>

            <div className="admin-import-field">
              <label className="admin-import-label">Nguoi thuc hien</label>
              <input
                value={currentUser?.name || currentUser?.username || 'Nhan vien phu trach'}
                readOnly
                className="admin-import-input readonly"
              />
            </div>

            <div className="admin-import-items-box">
              <p className="admin-import-items-title">San pham nhap</p>

              {formData.items.map((item, index) => (
                <div key={index} className="admin-import-item-row">
                  <select
                    name="idSanPham"
                    value={item.idSanPham}
                    onChange={(e) => handleInputChange(e, index)}
                    className="admin-import-control"
                  >
                    <option value="">-- Chon san pham --</option>
                    {productOptions.map((product) => (
                      <option key={product.id} value={product.id}>{product.tenSanPham}</option>
                    ))}
                  </select>

                  <input
                    type="number"
                    name="soLuong"
                    value={item.soLuong}
                    onChange={(e) => handleInputChange(e, index)}
                    className="admin-import-input"
                    placeholder="So luong"
                    min="1"
                  />

                  <input
                    type="number"
                    name="giaNhap"
                    value={item.giaNhap}
                    onChange={(e) => handleInputChange(e, index)}
                    className="admin-import-input"
                    placeholder="Gia nhap"
                    min="0"
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    aria-label="Xoa san pham"
                    title="Xoa san pham"
                    className="admin-import-remove-item-btn"
                  >
                    <CloseOutlined />
                  </button>
                </div>
              ))}

              <button type="button" onClick={handleAddItem} className="admin-import-add-item-btn">+ Them san pham</button>
            </div>

            <div className="admin-import-form-actions">
              <button type="button" onClick={handleCloseModal} className="admin-import-btn cancel">Huy</button>
              <button type="submit" className="admin-import-btn primary">Tao phieu nhap</button>
            </div>
          </form>
        </div>
      </Modal>

      {selectedReceipt && (
        <Modal isOpen={isDetailModalOpen} onClose={handleCloseDetailModal}>
          <div className="admin-import-modal-body">
            <h2 className="admin-import-modal-title">Chi tiet Phieu nhap #{selectedReceipt.id}</h2>

            <div className="admin-import-summary">
              <div className="admin-import-summary-row">
                <span className="admin-import-summary-label">Nha cung cap:</span>
                <span className="admin-import-summary-value">{selectedReceipt.tenNhaCungCap}</span>
              </div>
              <div className="admin-import-summary-row">
                <span className="admin-import-summary-label">Ngay nhap:</span>
                <span className="admin-import-summary-value">{formatDate(selectedReceipt.ngayNhap)}</span>
              </div>
              <div>
                <span className="admin-import-summary-label">Tong tien:</span>
                <span className="admin-import-summary-total">{formatCurrency(selectedReceipt.tongTien)}</span>
              </div>
            </div>

            <p className="admin-import-detail-title">Chi tiet san pham:</p>
            <div className="admin-import-detail-wrap">
              <table className="admin-table">
                <thead>
                  <tr className="admin-import-detail-head-row">
                    <th className="admin-import-detail-th">San pham</th>
                    <th className="admin-import-detail-th admin-import-detail-right">So luong</th>
                    <th className="admin-import-detail-th admin-import-detail-right">Gia nhap</th>
                    <th className="admin-import-detail-th admin-import-detail-right">Thanh tien</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedReceipt.items.map((item) => (
                    <tr key={item.id} className="admin-import-detail-row">
                      <td className="admin-import-detail-td">{item.tenSanPham}</td>
                      <td className="admin-import-detail-td admin-import-detail-right">{item.soLuong}</td>
                      <td className="admin-import-detail-td admin-import-detail-right">{formatCurrency(item.giaNhap)}</td>
                      <td className="admin-import-detail-td admin-import-detail-right admin-import-detail-td-strong">
                        {formatCurrency(item.soLuong * item.giaNhap)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="admin-import-detail-close-row">
              <button onClick={handleCloseDetailModal} className="admin-import-btn primary">Dong</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminImportReceiptsPage;
