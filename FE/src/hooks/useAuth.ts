import { useRecoilState, useResetRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { authAtom } from '../recoil/atoms/authAtom';
import { cartAtom } from '../recoil/atoms/cartAtom';
import { AuthUser } from '../types';
import {
  changePassword as changePasswordService,
  deleteAccount as deleteAccountService,
  getAccounts as getAccountsService,
  getCurrentUser as getCurrentUserService,
  login as loginService,
  register as registerService,
  updateAccount as updateAccountService,
} from '../services';

const isAdminRole = (vaiTro: string | null): boolean => {
  return vaiTro?.toLowerCase() === 'admin';
};

const mapBackendUser = (user: {
  id: number;
  tenDangNhap: string;
  tenHienThi: string | null;
  email: string | null;
  sdt: string | null;
  diaChi: string | null;
  vaiTro: string | null;
  trangThai?: boolean;
  isEmployee?: boolean;
  employeeRole?: 'staff' | 'supervisor' | 'manager';
}): AuthUser => {
  const displayName = user.tenHienThi || user.tenDangNhap;
  const normalizedRole = (user.vaiTro || '').toLowerCase();
  const isEmployee = user.isEmployee ?? normalizedRole === 'employee';
  const isAdmin = isAdminRole(user.vaiTro);

  return {
    id: user.id,
    name: displayName,
    email: user.email || user.tenDangNhap,
    role: isAdmin ? 'admin' : 'user',
    avatar: buildAvatar(displayName),
    phone: user.sdt || '',
    address: user.diaChi || '',
    username: user.tenDangNhap,
    isActive: user.trangThai,
    isEmployee,
    employeeRole: isEmployee ? (user.employeeRole || 'staff') : undefined,
    vaiTro: user.vaiTro || undefined,
  };
};

const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'object' && error && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) {
      return response.data.message;
    }
  }

  return 'Không thể kết nối máy chủ';
};

const buildAvatar = (name: string): string => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563eb&color=fff`;
};

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useRecoilState(authAtom);
  const resetCart = useResetRecoilState(cartAtom);
  const navigate = useNavigate();

  const login = async (
    tenDangNhap: string,
    matKhau: string,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const result = await loginService(tenDangNhap, matKhau);
      localStorage.setItem('auth_token', result.token);
      setCurrentUser(mapBackendUser(result.data));
      return { success: true, message: result.message };
    } catch (error: unknown) {
      return { success: false, message: getErrorMessage(error) };
    }
  };

  const register = async (
    tenDangNhap: string,
    name: string,
    email: string,
    password: string,
    phone: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const result = await registerService({
        tenDangNhap,
        matKhau: password,
        tenHienThi: name,
        email,
        sdt: phone,
      });
      return { success: true, message: result.message };
    } catch (error: unknown) {
      return { success: false, message: getErrorMessage(error) };
    }
  };

  const changePassword = async (
    matKhauCu: string,
    matKhauMoi: string,
  ): Promise<{ success: boolean; message: string }> => {
    if (!currentUser) {
      return { success: false, message: 'Bạn chưa đăng nhập' };
    }

    try {
      const result = await changePasswordService({
        id: currentUser.id,
        matKhauCu,
        matKhauMoi,
      });
      return { success: true, message: result.message };
    } catch (error: unknown) {
      return { success: false, message: getErrorMessage(error) };
    }
  };

  const getAccounts = async (): Promise<{ success: boolean; message: string; data: AuthUser[] }> => {
    try {
      const result = await getAccountsService();
      return {
        success: true,
        message: result.message,
        data: result.data.map(mapBackendUser),
      };
    } catch (error: unknown) {
      return { success: false, message: getErrorMessage(error), data: [] };
    }
  };

  const deleteAccount = async (id: number): Promise<{ success: boolean; message: string }> => {
    try {
      const result = await deleteAccountService(id);
      return { success: true, message: result.message };
    } catch (error: unknown) {
      return { success: false, message: getErrorMessage(error) };
    }
  };

  const updateAccount = async (payload: {
    id: number;
    tenHienThi?: string;
    email?: string;
    sdt?: string;
    diaChi?: string;
    vaiTro?: string;
  }): Promise<{ success: boolean; message: string; data?: AuthUser }> => {
    try {
      const result = await updateAccountService(payload);
      const updatedUser = mapBackendUser(result.data);

      if (currentUser && updatedUser.id === currentUser.id) {
        setCurrentUser(updatedUser);
      }

      return { success: true, message: result.message, data: updatedUser };
    } catch (error: unknown) {
      return { success: false, message: getErrorMessage(error) };
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('cart');
    resetCart();
    setCurrentUser(null);
    navigate('/login');
  };

  const getCurrentUser = async (): Promise<{ success: boolean; data?: AuthUser }> => {
    try {
      const result = await getCurrentUserService();
      const user = mapBackendUser(result.data);
      setCurrentUser(user);
      return { success: true, data: user };
    } catch (error: unknown) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      setCurrentUser(null);
      return { success: false };
    }
  };

  const isAdmin = currentUser?.role === 'admin';
  const isLoggedIn = !!currentUser;

  return {
    currentUser,
    login,
    register,
    changePassword,
    getAccounts,
    deleteAccount,
    updateAccount,
    logout,
    getCurrentUser,
    isAdmin,
    isLoggedIn,
  };
};
