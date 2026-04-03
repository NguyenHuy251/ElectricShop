export interface ProductRow {
  id: number;
  maSanPham: string | null;
  tenSanPham: string;
  slug: string;
  idDanhMuc: number | null;
  idThuongHieu: number | null;
  moTa: string | null;
  giaBan: number;
  giaGoc: number | null;
  baoHanhThang: number | null;
  hinhAnh: string | null;
  soLuongBan: number;
  danhGia: number;
  trangThai: boolean;
  ngayTao: Date;
  tenDanhMuc?: string | null;
  tenThuongHieu?: string | null;
}

export interface ProductImageRow {
  id: number;
  idSanPham: number;
  hinhAnh: string;
}

export interface ProductImagePublic {
  id: number;
  productId: number;
  imageUrl: string;
}

export interface ProductPublic {
  id: number;
  maSanPham: string | null;
  tenSanPham: string;
  slug: string;
  idDanhMuc: number | null;
  idThuongHieu: number | null;
  moTa: string | null;
  giaBan: number;
  giaGoc: number | null;
  baoHanhThang: number | null;
  hinhAnh: string | null;
  soLuongBan: number;
  danhGia: number;
  trangThai: boolean;
  ngayTao: Date;
  tenDanhMuc?: string | null;
  tenThuongHieu?: string | null;
}

export interface CreateProductRequestBody {
  maSanPham?: string;
  tenSanPham: string;
  slug: string;
  idDanhMuc?: number | null;
  idThuongHieu?: number | null;
  moTa?: string;
  giaBan: number;
  giaGoc?: number | null;
  baoHanhThang?: number | null;
  hinhAnh?: string;
  soLuongBan?: number;
  danhGia?: number;
  trangThai?: boolean;
}

export interface UpdateProductRequestBody {
  maSanPham?: string;
  tenSanPham?: string;
  slug?: string;
  idDanhMuc?: number | null;
  idThuongHieu?: number | null;
  moTa?: string;
  giaBan?: number;
  giaGoc?: number | null;
  baoHanhThang?: number | null;
  hinhAnh?: string;
  soLuongBan?: number;
  danhGia?: number;
}

export interface UpdateProductStatusRequestBody {
  trangThai: boolean;
}
