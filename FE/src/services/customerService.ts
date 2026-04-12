import {
  deleteCustomerApi,
  getCustomersApi,
  updateCustomerApi,
  type UpdateCustomerPayload,
} from '../api/customerApi';

export const getCustomers = () => getCustomersApi();
export const updateCustomer = (id: number, payload: UpdateCustomerPayload) => updateCustomerApi(id, payload);
export const deleteCustomer = (id: number) => deleteCustomerApi(id);
