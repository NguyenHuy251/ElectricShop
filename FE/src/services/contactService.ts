import {
  createContactMessageApi,
  getContactMessagesApi,
  getContactsByAccountApi,
  updateContactReplyApi,
  updateContactStatusApi,
} from '../api/contactApi';
import type {
  ContactStatus,
  CreateContactMessagePayload,
  GetContactsByAccountPayload,
  UpdateContactReplyPayload,
} from '../types/contact';

export const getContactMessages = () => {
  return getContactMessagesApi();
};

export const createContactMessage = (payload: CreateContactMessagePayload) => {
  return createContactMessageApi(payload);
};

export const getContactsByAccount = (payload: GetContactsByAccountPayload) => {
  return getContactsByAccountApi(payload);
};

export const updateContactStatus = (id: number, trangThai: ContactStatus) => {
  return updateContactStatusApi(id, trangThai);
};

export const updateContactReply = (id: number, payload: UpdateContactReplyPayload) => {
  return updateContactReplyApi(id, payload);
};
