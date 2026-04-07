import {
  addCartItemApi,
  clearCartApi,
  getCartApi,
  removeCartItemApi,
  updateCartItemApi,
} from '../api/cartApi';

export const getCart = () => getCartApi();
export const addCartItem = (payload: { idSanPham: number; soLuong: number }) => addCartItemApi(payload);
export const updateCartItem = (productId: number, payload: { soLuong: number }) => updateCartItemApi(productId, payload);
export const removeCartItem = (productId: number) => removeCartItemApi(productId);
export const clearCart = () => clearCartApi();
