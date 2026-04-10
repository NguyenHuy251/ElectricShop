import {
  createEmployeeApi,
  deleteEmployeeApi,
  getEmployeesApi,
  updateEmployeeApi,
  type EmployeePayload,
} from '../api/employeeApi';

export const getEmployees = () => getEmployeesApi();
export const createEmployee = (payload: EmployeePayload) => createEmployeeApi(payload);
export const updateEmployee = (id: number, payload: Partial<EmployeePayload>) => updateEmployeeApi(id, payload);
export const deleteEmployee = (id: number) => deleteEmployeeApi(id);
