import type { ContactMessage } from './index';

export interface CreateContactMessagePayload {
  idTaiKhoan?: number;
  hoTen: string;
  email: string;
  sdt?: string;
  tieuDe: string;
  noiDung: string;
}

export interface GetContactsByAccountPayload {
  idTaiKhoan?: number;
  email?: string;
}

export interface UpdateContactReplyPayload {
  phanHoi: string;
  nguoiPhanHoi: string;
}

export type ContactStatus = ContactMessage['trangThai'];