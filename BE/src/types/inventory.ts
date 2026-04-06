export interface InventoryStockRow {
  idSanPham: number;
  tenSanPham: string;
  slug: string;
  soLuongTon: number;
}

export interface InventoryStockPublic {
  idSanPham: number;
  tenSanPham: string;
  slug: string;
  soLuongTon: number;
}

export interface ImportReceiptRow {
  id: number;
  idNhaCungCap: number;
  idNhanVienLap: number | null;
  tongTien: number;
  ngayNhap: Date;
  tenNhaCungCap: string;
  tenNhanVienLap: string | null;
}

export interface ImportReceiptDetailRow {
  id: number;
  idPhieuNhap: number;
  idSanPham: number;
  soLuong: number;
  giaNhap: number;
  tenSanPham: string;
}

export interface ImportReceiptPublic {
  id: number;
  idNhaCungCap: number;
  idNhanVienLap: number | null;
  tongTien: number;
  ngayNhap: Date;
  tenNhaCungCap: string;
  tenNhanVienLap: string | null;
}

export interface ImportReceiptDetailPublic {
  id: number;
  idPhieuNhap: number;
  idSanPham: number;
  soLuong: number;
  giaNhap: number;
  tenSanPham: string;
}

export interface CreateImportReceiptItemRequestBody {
  idSanPham: number;
  soLuong: number;
  giaNhap: number;
}

export interface CreateImportReceiptRequestBody {
  idNhaCungCap: number;
  idNhanVienLap?: number | null;
  items: CreateImportReceiptItemRequestBody[];
}
