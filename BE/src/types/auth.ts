export interface LoginRequestBody {
  tenDangNhap: string;
  matKhau: string;
}

export interface RegisterRequestBody {
  tenDangNhap: string;
  matKhau: string;
  tenHienThi?: string;
  email?: string;
  sdt?: string;
  diaChi?: string;
}

export interface ChangePasswordRequestBody {
  id: number;
  matKhauCu: string;
  matKhauMoi: string;
}

export interface TaiKhoanPublic {
  id: number;
  tenDangNhap: string;
  tenHienThi: string | null;
  email: string | null;
  sdt: string | null;
  diaChi: string | null;
  vaiTro: string | null;
  trangThai: boolean;
}
