import { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { categoriesAtom } from '../recoil/atoms/categoryAtom';
import { getCategories, mapBackendCategoryListToCategories } from '../services';

export const useCategoriesInitialize = () => {
  const setCategories = useSetRecoilState(categoriesAtom);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initCategories = async () => {
      try {
        const response = await getCategories();
        if (isMounted) {
          setCategories(mapBackendCategoryListToCategories(response.data));
        }
      } catch (error) {
        console.error('Khong the tai danh muc tu API:', error);
        if (isMounted) {
          setCategories([]);
        }
      } finally {
        if (isMounted) {
          setIsInitialized(true);
        }
      }
    };

    void initCategories();

    return () => {
      isMounted = false;
    };
  }, [setCategories]);

  return isInitialized;
};
