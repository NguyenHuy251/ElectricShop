import { useRecoilState } from 'recoil';
import { cartAtom } from '../recoil/atoms/cartAtom';
import { Product } from '../types';

export const useCart = () => {
  const [cart, setCart] = useRecoilState(cartAtom);

  const addToCart = (product: Product, quantity = 1) => {
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
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
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
  };

  const clearCart = () => setCart([]);

  const isInCart = (productId: number) => cart.some((item) => item.productId === productId);

  return { cart, addToCart, removeFromCart, updateQuantity, clearCart, isInCart };
};
