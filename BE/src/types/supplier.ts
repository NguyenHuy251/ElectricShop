export interface SupplierRow {
  id: number;
  tenNhaCungCap: string;
  sdt: string | null;
  email: string | null;
  diaChi: string | null;
}

export interface SupplierPublic {
  id: number;
  tenNhaCungCap: string;
  sdt: string;
  email: string;
  diaChi: string;
}

export interface CreateSupplierRequestBody {
  tenNhaCungCap: string;
  sdt?: string;
  email?: string;
  diaChi?: string;
}

export interface UpdateSupplierRequestBody {
  tenNhaCungCap?: string;
  sdt?: string;
  email?: string;
  diaChi?: string;
}
