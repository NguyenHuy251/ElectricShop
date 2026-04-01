import { useEffect } from 'react';
import { useAuth } from './useAuth';

/**
 * Hook để validate và refresh user data từ server khi app initialize
 * Gọi một lần khi app mount
 */
export const useAuthInitialize = () => {
  const { isLoggedIn, getCurrentUser } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      // Validate token và lấy dữ liệu mới từ server
      getCurrentUser();
    }
  }, []); // Chỉ chạy một lần khi mount
};
