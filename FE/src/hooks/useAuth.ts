import { useRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { authAtom } from '../recoil/atoms/authAtom';
import { users } from '../data/mockData';
import { AuthUser } from '../types';

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useRecoilState(authAtom);
  const navigate = useNavigate();

  const login = (email: string, password: string): { success: boolean; message: string } => {
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) return { success: false, message: 'Email hoặc mật khẩu không đúng' };

    const authUser: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
      address: user.address,
    };
    setCurrentUser(authUser);
    return { success: true, message: 'Đăng nhập thành công' };
  };

  const register = (
    name: string,
    email: string,
    password: string,
    phone: string
  ): { success: boolean; message: string } => {
    const exists = users.find((u) => u.email === email);
    if (exists) return { success: false, message: 'Email đã được sử dụng' };

    const newUser: AuthUser = {
      id: Date.now(),
      name,
      email,
      role: 'user',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563eb&color=fff`,
      phone,
      address: '',
    };
    setCurrentUser(newUser);
    return { success: true, message: 'Đăng ký thành công' };
  };

  const logout = () => {
    setCurrentUser(null);
    navigate('/login');
  };

  const isAdmin = currentUser?.role === 'admin';
  const isLoggedIn = !!currentUser;

  return { currentUser, login, register, logout, isAdmin, isLoggedIn };
};
