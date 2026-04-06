import type { ContactMessage } from '../types';
import type {
  ContactStatus,
  CreateContactMessagePayload,
  GetContactsByAccountPayload,
  UpdateContactReplyPayload,
} from '../types/contact';

const CONTACT_STORAGE_KEY = 'contact_messages';

const sampleContactMessages: ContactMessage[] = [
  {
    id: 1,
    idTaiKhoan: 2,
    hoTen: 'Nguyen Van A',
    email: 'a@gmail.com',
    sdt: '0901111111',
    tieuDe: 'Can tu van bao hanh quat Panasonic',
    noiDung: 'San pham mua duoc 8 thang, vui long huong dan quy trinh bao hanh.',
    trangThai: 'new',
    ngayTao: '2026-03-27T09:10:00.000Z',
  },
  {
    id: 2,
    idTaiKhoan: 3,
    hoTen: 'Tran Thi B',
    email: 'b@gmail.com',
    sdt: '0902222222',
    tieuDe: 'Hoi ve hoa don VAT',
    noiDung: 'Don hang DH002 cua toi can xuat hoa don VAT cong ty.',
    trangThai: 'contacted',
    ngayTao: '2026-03-27T08:30:00.000Z',
  },
  {
    id: 3,
    idTaiKhoan: 4,
    hoTen: 'Le Van C',
    email: 'c@gmail.com',
    sdt: '0903333333',
    tieuDe: 'Muon doi san pham loi',
    noiDung: 'Am sieu toc bi ro dien nhe, toi muon doi sang san pham khac.',
    trangThai: 'closed',
    ngayTao: '2026-03-26T14:05:00.000Z',
  },
  {
    id: 4,
    idTaiKhoan: 5,
    hoTen: 'Pham Thi D',
    email: 'd@gmail.com',
    sdt: '0904444444',
    tieuDe: 'Dat mua si cho cua hang',
    noiDung: 'Ben minh can bao gia mua si may hut bui va noi com trong thang nay.',
    trangThai: 'new',
    ngayTao: '2026-03-26T10:45:00.000Z',
  },
  {
    id: 5,
    idTaiKhoan: 2,
    hoTen: 'Doan Minh Khoa',
    email: 'khoa@gmail.com',
    sdt: '0905551234',
    tieuDe: 'Ho tro cap nhat dia chi giao hang',
    noiDung: 'Nho shop cap nhat dia chi giao hang cho don da dat hom qua.',
    trangThai: 'contacted',
    ngayTao: '2026-03-25T16:20:00.000Z',
  },
  {
    id: 6,
    idTaiKhoan: 3,
    hoTen: 'Vo Thanh Nhan',
    email: 'nhan@gmail.com',
    sdt: '0906789123',
    tieuDe: 'Gop y dich vu sau ban',
    noiDung: 'Mong shop co them tong dai gio toi va cap nhat trang thai don hang nhanh hon.',
    trangThai: 'closed',
    ngayTao: '2026-03-24T07:50:00.000Z',
  },
];

const readMessages = (): ContactMessage[] => {
  try {
    const raw = localStorage.getItem(CONTACT_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as ContactMessage[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (_error: unknown) {
    return [];
  }
};

const writeMessages = (messages: ContactMessage[]): void => {
  localStorage.setItem(CONTACT_STORAGE_KEY, JSON.stringify(messages));
};

const ensureSeededMessages = (): ContactMessage[] => {
  const current = readMessages();
  if (current.length > 0) return current;

  const seeded = sampleContactMessages.map((item) => ({ ...item }));
  writeMessages(seeded);
  return seeded;
};

export const getContactMessagesApi = (): ContactMessage[] => {
  return ensureSeededMessages().sort((a, b) => new Date(b.ngayTao).getTime() - new Date(a.ngayTao).getTime());
};

export const createContactMessageApi = (payload: CreateContactMessagePayload): ContactMessage => {
  const messages = ensureSeededMessages();
  const nextId = messages.length > 0 ? Math.max(...messages.map((item) => item.id)) + 1 : 1;

  const newMessage: ContactMessage = {
    id: nextId,
    idTaiKhoan: payload.idTaiKhoan,
    hoTen: payload.hoTen,
    email: payload.email,
    sdt: payload.sdt,
    tieuDe: payload.tieuDe,
    noiDung: payload.noiDung,
    trangThai: 'new',
    ngayTao: new Date().toISOString(),
  };

  messages.push(newMessage);
  writeMessages(messages);
  return newMessage;
};

export const getContactsByAccountApi = (payload: GetContactsByAccountPayload): ContactMessage[] => {
  const messages = ensureSeededMessages();

  const normalizedEmail = payload.email?.trim().toLowerCase();

  const filtered = messages.filter((item) => {
    if (payload.idTaiKhoan !== undefined && item.idTaiKhoan === payload.idTaiKhoan) {
      return true;
    }

    if (!normalizedEmail) return false;
    return item.email.trim().toLowerCase() === normalizedEmail;
  });

  return filtered.sort((a, b) => new Date(b.ngayTao).getTime() - new Date(a.ngayTao).getTime());
};

export const updateContactStatusApi = (id: number, trangThai: ContactStatus): ContactMessage | null => {
  const messages = ensureSeededMessages();
  const index = messages.findIndex((item) => item.id === id);

  if (index < 0) return null;

  messages[index] = { ...messages[index], trangThai };
  writeMessages(messages);
  return messages[index];
};

export const updateContactReplyApi = (
  id: number,
  payload: UpdateContactReplyPayload,
): ContactMessage | null => {
  const messages = ensureSeededMessages();
  const index = messages.findIndex((item) => item.id === id);

  if (index < 0) return null;

  messages[index] = {
    ...messages[index],
    phanHoi: payload.phanHoi,
    nguoiPhanHoi: payload.nguoiPhanHoi,
    ngayPhanHoi: new Date().toISOString(),
    trangThai: messages[index].trangThai === 'new' ? 'contacted' : messages[index].trangThai,
  };

  writeMessages(messages);
  return messages[index];
};