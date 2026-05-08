import React, { useEffect, useMemo, useState } from 'react';
import { CloseOutlined, DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import Modal from '../../components/ui/Modal';
import { useAuth } from '../../hooks/useAuth';
import { useProducts } from '../../hooks/useProducts';
import { getApiErrorMessage } from '../../utils/apiError';
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
  const { products, reloadProducts } = useProducts();

  const [receipts, setReceipts] = useState<ImportReceipt[]>([]);
  const [search, setSearch] = useState('');
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

  const filteredReceipts = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) {
      return receipts;
    }

    return receipts.filter((receipt) => {
      return [String(receipt.id), receipt.tenNhaCungCap, receipt.tenNhanVienLap || '']
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(keyword));
    });
  }, [receipts, search]);

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
      alert('Không thể tải dữ liệu phiếu nhập');
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
      alert('Không thể tải chi tiết phiếu nhập');
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
      alert('Vui lòng chọn nhà cung cấp và thêm ít nhất một sản phẩm');
      return;
    }

    const supplier = suppliers.find((s) => s.id === parseInt(formData.idNhaCungCap, 10));
    if (!supplier) {
      alert('Nhà cung cấp không hợp lệ');
      return;
    }

    const payloadItems: Array<{ idSanPham: number; soLuong: number; giaNhap: number }> = [];

    for (let index = 0; index < formData.items.length; index += 1) {
      const item = formData.items[index];
      if (!item.idSanPham || !item.soLuong || !item.giaNhap) {
        alert(`Vui lòng nhập đầy đủ thông tin sản phẩm thứ ${index + 1}`);
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
      await reloadProducts();
      window.alert('Tạo phiếu nhập thành công');
      handleCloseModal();
    } catch (error: unknown) {
      window.alert(getApiErrorMessage(error, 'Không thể tạo phiếu nhập'));
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa phiếu nhập này?')) {
      return;
    }

    try {
      await deleteImportReceipt(id);
      setReceipts((prev) => prev.filter((r) => r.id !== id));
      window.alert('Xóa phiếu nhập thành công');
    } catch (error: unknown) {
      window.alert(getApiErrorMessage(error, 'Không thể xóa phiếu nhập'));
    }
  };

  return (
    <div className="admin-import-page">
      <div className="admin-page-header">
        <h1 className="admin-import-header-title">Quản lý Phiếu nhập hàng</h1>
        <button onClick={handleOpenModal} className="admin-import-create-btn">
          <PlusOutlined /> Tạo phiếu nhập
        </button>
      </div>

      <div className="admin-search-wrap">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-search-input"
          placeholder="Tìm theo mã phiếu, nhà cung cấp hoặc người thực hiện..."
        />
      </div>

      <div className="admin-import-table-wrap">
        <table className="admin-table">
          <thead>
            <tr className="admin-import-head-row">
              <th className="admin-import-th">ID</th>
              <th className="admin-import-th">Nhà cung cấp</th>
              <th className="admin-import-th admin-import-th-right">Tổng tiền</th>
              <th className="admin-import-th">Ngày nhập</th>
              <th className="admin-import-th">Người thực hiện</th>
              <th className="admin-import-th admin-import-th-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6} className="admin-empty-state">Đang tải dữ liệu phiếu nhập...</td>
              </tr>
            )}
            {!isLoading && filteredReceipts.map((receipt) => (
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
                      <EyeOutlined /> Xem chi tiết
                    </button>
                    <button onClick={() => void handleDelete(receipt.id)} className="admin-import-action-btn delete">
                      <DeleteOutlined /> Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!isLoading && filteredReceipts.length === 0 && (
              <tr>
                <td colSpan={6} className="admin-empty-state">Chưa có phiếu nhập nào</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} size="lg">
        <div className="admin-import-modal-body">
          <h2 className="admin-import-modal-title">Tạo phiếu nhập hàng mới</h2>

          <form onSubmit={handleSubmit}>
            <div className="admin-import-field">
              <label className="admin-import-label">Chọn nhà cung cấp <span className="admin-import-label-required">*</span></label>
              <select
                name="idNhaCungCap"
                value={formData.idNhaCungCap}
                onChange={handleInputChange}
                className="admin-import-control"
              >
                <option value="">-- Chọn nhà cung cấp --</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>{supplier.tenNhaCungCap}</option>
                ))}
              </select>
            </div>

            <div className="admin-import-field">
              <label className="admin-import-label">Người thực hiện</label>
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

              <button type="button" onClick={handleAddItem} className="admin-import-add-item-btn">+ Thêm sản phẩm</button>
            </div>

            <div className="admin-import-form-actions">
              <button type="button" onClick={handleCloseModal} className="admin-import-btn cancel">Hủy</button>
              <button type="submit" className="admin-import-btn primary">Tạo phiếu nhập</button>
            </div>
          </form>
        </div>
      </Modal>

      {selectedReceipt && (
        <Modal isOpen={isDetailModalOpen} onClose={handleCloseDetailModal}>
          <div className="admin-import-modal-body">
            <h2 className="admin-import-modal-title">Chi tiết Phiếu nhập #{selectedReceipt.id}</h2>

            <div className="admin-import-summary">
              <div className="admin-import-summary-row">
                <span className="admin-import-summary-label">Nhà cung cấp:</span>
                <span className="admin-import-summary-value">{selectedReceipt.tenNhaCungCap}</span>
              </div>
              <div className="admin-import-summary-row">
                <span className="admin-import-summary-label">Ngày nhập:</span>
                <span className="admin-import-summary-value">{formatDate(selectedReceipt.ngayNhap)}</span>
              </div>
              <div>
                <span className="admin-import-summary-label">Tổng tiền:</span>
                <span className="admin-import-summary-total">{formatCurrency(selectedReceipt.tongTien)}</span>
              </div>
            </div>

            <p className="admin-import-detail-title">Chi tiết sản phẩm:</p>
            <div className="admin-import-detail-wrap">
              <table className="admin-table">
                <thead>
                  <tr className="admin-import-detail-head-row">
                    <th className="admin-import-detail-th">Sản phẩm</th>
                    <th className="admin-import-detail-th admin-import-detail-right">Số lượng</th>
                    <th className="admin-import-detail-th admin-import-detail-right">Giá nhập</th>
                    <th className="admin-import-detail-th admin-import-detail-right">Thành tiền</th>
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
              <button onClick={handleCloseDetailModal} className="admin-import-btn primary">Đóng</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminImportReceiptsPage;
