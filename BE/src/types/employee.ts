export interface EmployeeRow {
  id: number;
  idTaiKhoan: number;
  maNhanVien: string;
  hoTen: string;
  sdt: string | null;
  email: string | null;
  diaChi: string | null;
  chucVu: string | null;
  boPhan: string | null;
  ngayVaoLam: Date | null;
  luongCoBan: number | null;
  trangThai: boolean;
}

export interface EmployeePublic {
  id: number;
  idTaiKhoan: number;
  maNhanVien: string;
  hoTen: string;
  sdt: string;
  email: string;
  diaChi: string;
  chucVu: string;
  boPhan: string;
  ngayVaoLam: string;
  luongCoBan: number;
  trangThai: boolean;
}

export interface CreateEmployeeRequestBody {
  idTaiKhoan?: number;
  maNhanVien: string;
  hoTen: string;
  sdt?: string;
  email?: string;
  diaChi?: string;
  chucVu?: string;
  boPhan?: string;
  ngayVaoLam?: string;
  luongCoBan?: number;
  trangThai?: boolean;
}

export interface UpdateEmployeeRequestBody {
  maNhanVien?: string;
  hoTen?: string;
  sdt?: string;
  email?: string;
  diaChi?: string;
  chucVu?: string;
  boPhan?: string;
  ngayVaoLam?: string;
  luongCoBan?: number;
  trangThai?: boolean;
}
