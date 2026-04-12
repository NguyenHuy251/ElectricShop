export interface CategoryRow {
  id: number;
  tenDanhMuc: string;
  slug: string | null;
  moTa: string | null;
  trangThai: boolean;
}

export interface CategoryPublic {
  id: number;
  tenDanhMuc: string;
  slug: string;
  moTa: string;
  trangThai: boolean;
}

export interface CreateCategoryRequestBody {
  tenDanhMuc: string;
  slug?: string;
  moTa?: string;
  trangThai?: boolean;
}

export interface UpdateCategoryRequestBody {
  tenDanhMuc?: string;
  slug?: string;
  moTa?: string;
  trangThai?: boolean;
}
