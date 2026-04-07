export interface ReviewRow {
  id: number;
  idSanPham: number;
  idTaiKhoan: number;
  soSao: number;
  noiDung: string | null;
  ngayDanhGia: Date;
  tenDangNhap: string;
  tenHienThi: string | null;
  tenSanPham: string;
}

export interface ReviewPublic {
  id: number;
  idSanPham: number;
  idTaiKhoan: number;
  soSao: number;
  noiDung: string;
  ngayDanhGia: Date;
  tenSanPham: string;
  tenKhachHang: string;
}

export interface CreateReviewRequestBody {
  idSanPham: number;
  soSao: number;
  noiDung?: string;
}

export interface UpdateReviewRequestBody {
  soSao?: number;
  noiDung?: string;
}
