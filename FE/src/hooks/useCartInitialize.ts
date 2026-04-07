import { useEffect, useRef, useState } from 'react';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { authAtom } from '../recoil/atoms/authAtom';
import { cartAtom } from '../recoil/atoms/cartAtom';
import { getCart } from '../services';
import { mapBackendProductToProduct } from '../api/productApi';

export const useCartInitialize = () => {
  const currentUser = useRecoilValue(authAtom);
  const setCart = useSetRecoilState(cartAtom);
  const [isInitialized, setIsInitialized] = useState(false);
  const loadedUserIdRef = useRef<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initCart = async () => {
      if (!currentUser) {
        if (isMounted) {
          setCart([]);
          loadedUserIdRef.current = null;
          setIsInitialized(true);
        }
        return;
      }

      if (loadedUserIdRef.current === currentUser.id) {
        if (isMounted) {
          setIsInitialized(true);
        }
        return;
      }

      try {
        const response = await getCart();
        if (isMounted) {
          setCart(response.data.map((item) => ({
            productId: item.idSanPham,
            quantity: item.soLuong,
            product: mapBackendProductToProduct(item.product),
          })));
          loadedUserIdRef.current = currentUser.id;
        }
      } catch (error) {
        console.error('Không thể tải giỏ hàng từ API:', error);
      } finally {
        if (isMounted) {
          setIsInitialized(true);
        }
      }
    };

    void initCart();

    return () => {
      isMounted = false;
    };
  }, [currentUser, setCart]);

  return isInitialized;
};
