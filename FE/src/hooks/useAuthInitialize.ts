import { useEffect, useRef, useState } from 'react';
import { useAuth } from './useAuth';

/**
 * Hook để validate và refresh user data từ server khi app initialize
 * Gọi một lần khi app mount
 */
export const useAuthInitialize = () => {
  const { isLoggedIn, getCurrentUser } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  const isLoggedInRef = useRef(isLoggedIn);
  const getCurrentUserRef = useRef(getCurrentUser);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      if (isLoggedInRef.current) {
        await getCurrentUserRef.current();
      }

      if (isMounted) {
        setIsInitialized(true);
      }
    };

    void initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  return isInitialized;
};
