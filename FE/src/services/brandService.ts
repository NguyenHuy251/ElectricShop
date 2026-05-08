import {
  createBrandApi,
  deleteBrandApi,
  getBrandByIdApi,
  getBrandsApi,
  type BrandPayload,
  updateBrandApi,
} from '../api/brandApi';

export const getBrands = () => getBrandsApi();
export const getBrandById = (id: number) => getBrandByIdApi(id);
export const createBrand = (payload: BrandPayload) => createBrandApi(payload);
export const updateBrand = (id: number, payload: BrandPayload) => updateBrandApi(id, payload);
export const deleteBrand = (id: number) => deleteBrandApi(id);
