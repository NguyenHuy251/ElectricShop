export interface NewsRow {
  id: number;
  idNhanVienDang: number | null;
  tieuDe: string;
  slug: string;
  noiDung: string;
  hinhAnh: string | null;
  ngayDang: Date;
  tenNhanVienDang: string | null;
}

export interface NewsPublic {
  id: number;
  title: string;
  slug: string;
  content: string;
  image: string;
  publishedAt: string;
  idNhanVienDang?: number;
  tenNhanVienDang?: string;
}

export interface CreateNewsRequestBody {
  title: string;
  slug: string;
  content: string;
  image?: string;
  publishedAt?: string;
  idNhanVienDang?: number;
}

export interface UpdateNewsRequestBody {
  title?: string;
  slug?: string;
  content?: string;
  image?: string;
  publishedAt?: string;
  idNhanVienDang?: number;
}
