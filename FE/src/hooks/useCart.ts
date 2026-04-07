import { useRecoilState, useRecoilValue } from 'recoil';
import { useLocation, useNavigate } from 'react-router-dom';
import { authAtom } from '../recoil/atoms/authAtom';
import { cartAtom } from '../recoil/atoms/cartAtom';
import { addCartItem, clearCart as clearRemoteCart, removeCartItem, updateCartItem } from '../services';
import { Product } from '../types';

export const useCart = () => {
  const [cart, setCart] = useRecoilState(cartAtom);
  const currentUser = useRecoilValue(authAtom);
  const navigate = useNavigate();
  const location = useLocation();

  const syncAddToCart = (productId: number, quantity: number) => {
    if (!currentUser) {
      return;
    }

    void addCartItem({ idSanPham: productId, soLuong: quantity }).catch((error) => {
      console.error('Không thể đồng bộ giỏ hàng:', error);
    });
  };

  const syncUpdateQuantity = (productId: number, quantity: number) => {
    if (!currentUser) {
      return;
    }

    void updateCartItem(productId, { soLuong: quantity }).catch((error) => {
      console.error('Không thể cập nhật giỏ hàng:', error);
    });
  };

  const syncRemoveFromCart = (productId: number) => {
    if (!currentUser) {
      return;
    }

    void removeCartItem(productId).catch((error) => {
      console.error('Không thể xóa sản phẩm khỏi giỏ hàng:', error);
    });
  };

  const syncClearCart = () => {
    if (!currentUser) {
      return;
    }

    void clearRemoteCart().catch((error) => {
      console.error('Không thể xóa toàn bộ giỏ hàng:', error);
    });
  };

  const addToCart = (product: Product, quantity = 1): boolean => {
    if (!currentUser) {
      window.alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
      navigate('/login', { state: { from: location } });
      return false;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      }
      return [...prev, { productId: product.id, quantity, product }];
    });
    syncAddToCart(product.id, quantity);
    return true;
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
    syncRemoveFromCart(productId);
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
    syncUpdateQuantity(productId, quantity);
  };

  const clearCart = () => {
    setCart([]);
    syncClearCart();
  };

  const isInCart = (productId: number) => cart.some((item) => item.productId === productId);

  return { cart, addToCart, removeFromCart, updateQuantity, clearCart, isInCart };
};
