export interface BrandRow {
  id: number;
  tenThuongHieu: string;
  slug: string | null;
  logo: string | null;
  quocGia: string | null;
  trangThai: boolean;
}

export interface BrandPublic {
  id: number;
  tenThuongHieu: string;
  slug: string;
  logo: string;
  quocGia: string;
  trangThai: boolean;
}

export interface CreateBrandRequestBody {
  tenThuongHieu: string;
  slug?: string;
  logo?: string;
  quocGia?: string;
  trangThai?: boolean;
}

export interface UpdateBrandRequestBody {
  tenThuongHieu?: string;
  slug?: string;
  logo?: string;
  quocGia?: string;
  trangThai?: boolean;
}
