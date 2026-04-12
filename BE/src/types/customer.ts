export interface CustomerRow {
  id: number;
  idTaiKhoan: number;
  maKhachHang: string;
  hoTen: string;
  ngaySinh: Date | null;
  gioiTinh: string | null;
  ghiChu: string | null;
  trangThai: boolean;
  tenDangNhap: string | null;
  email: string | null;
  sdt: string | null;
  diaChi: string | null;
}

export interface CustomerPublic {
  id: number;
  idTaiKhoan: number;
  maKhachHang: string;
  hoTen: string;
  ngaySinh: string;
  gioiTinh: string;
  ghiChu: string;
  trangThai: boolean;
  tenDangNhap: string;
  email: string;
  sdt: string;
  diaChi: string;
}

export interface UpdateCustomerRequestBody {
  hoTen?: string;
  ngaySinh?: string;
  gioiTinh?: string;
  ghiChu?: string;
  email?: string;
  sdt?: string;
  diaChi?: string;
  trangThai?: boolean;
}
