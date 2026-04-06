import { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { productsAtom } from '../recoil/atoms/productAtom';
import { products as mockProducts } from '../data/mockData';
import { getProducts, mapBackendProductListToProducts } from '../services';

export const useProductsInitialize = () => {
  const setProducts = useSetRecoilState(productsAtom);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initProducts = async () => {
      try {
        const response = await getProducts();
        if (isMounted) {
          setProducts(mapBackendProductListToProducts(response.data));
        }
      } catch (error) {
        console.error('Không thể tải danh sách sản phẩm từ API:', error);
        if (isMounted) {
          setProducts(mockProducts);
        }
      } finally {
        if (isMounted) {
          setIsInitialized(true);
        }
      }
    };

    void initProducts();

    return () => {
      isMounted = false;
    };
  }, [setProducts]);

  return isInitialized;
};
