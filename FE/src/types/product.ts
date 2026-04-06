export interface BackendProduct {
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
  ngayTao: string;
  tenDanhMuc?: string | null;
  tenThuongHieu?: string | null;
}

export interface BackendProductImage {
  id: number;
  productId: number;
  imageUrl: string;
}