import type { Request, Response } from 'express';
import {
  ProductError,
  createProductService,
  deleteProductImageService,
  getProductByIdService,
  getProductImagesService,
  getProductBySlugService,
  getProductsService,
  softDeleteProductService,
  updateProductService,
  updateProductStatusService,
} from '../services/productService.js';
import type {
  CreateProductRequestBody,
  UpdateProductRequestBody,
  UpdateProductStatusRequestBody,
} from '../types/product.js';

const handleError = (error: unknown, res: Response): void => {
  if (error instanceof ProductError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  console.error('Unexpected error:', error instanceof Error ? error.message : error);
  res.status(500).json({ message: 'Lỗi hệ thống' });
};

export const getProductsController = async (_req: Request, res: Response): Promise<void> => {
  try {
    const products = await getProductsService();
    res.status(200).json({ message: 'Lấy danh sách sản phẩm thành công', data: products });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getProductByIdController = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'id không hợp lệ' });
    return;
  }

  try {
    const product = await getProductByIdService(id);
    res.status(200).json({ message: 'Lấy sản phẩm thành công', data: product });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getProductBySlugController = async (req: Request<{ slug: string }>, res: Response): Promise<void> => {
  const slug = req.params.slug?.trim();
  if (!slug) {
    res.status(400).json({ message: 'slug không hợp lệ' });
    return;
  }

  try {
    const product = await getProductBySlugService(slug);
    res.status(200).json({ message: 'Lấy sản phẩm thành công', data: product });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getProductImagesController = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'id không hợp lệ' });
    return;
  }

  try {
    const images = await getProductImagesService(id);
    res.status(200).json({ message: 'Lấy danh sách ảnh sản phẩm thành công', data: images });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const createProductController = async (
  req: Request<unknown, unknown, CreateProductRequestBody>,
  res: Response,
): Promise<void> => {
  const payload = req.body;

  if (!payload.tenSanPham || !payload.slug || payload.giaBan === undefined) {
    res.status(400).json({ message: 'Vui lòng nhập tenSanPham, slug, giaBan' });
    return;
  }

  try {
    const created = await createProductService(payload);
    res.status(201).json({ message: 'Tạo sản phẩm thành công', data: created });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const updateProductController = async (
  req: Request<{ id: string }, unknown, UpdateProductRequestBody>,
  res: Response,
): Promise<void> => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'id không hợp lệ' });
    return;
  }

  try {
    const updated = await updateProductService(id, req.body);
    res.status(200).json({ message: 'Cập nhật sản phẩm thành công', data: updated });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const deleteProductController = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'id không hợp lệ' });
    return;
  }

  try {
    await softDeleteProductService(id);
    res.status(200).json({ message: 'Xóa sản phẩm thành công (đã chuyển trạng thái inactive)' });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const updateProductStatusController = async (
  req: Request<{ id: string }, unknown, UpdateProductStatusRequestBody>,
  res: Response,
): Promise<void> => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'id không hợp lệ' });
    return;
  }

  if (typeof req.body.trangThai !== 'boolean') {
    res.status(400).json({ message: 'trangThai phải là boolean' });
    return;
  }

  try {
    const updated = await updateProductStatusService(id, req.body.trangThai);
    res.status(200).json({ message: 'Cập nhật trạng thái sản phẩm thành công', data: updated });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const deleteProductImageController = async (
  req: Request<{ id: string; imageId: string }>,
  res: Response,
): Promise<void> => {
  const id = Number(req.params.id);
  const imageId = Number(req.params.imageId);

  if (!Number.isInteger(id) || id <= 0 || !Number.isInteger(imageId) || imageId <= 0) {
    res.status(400).json({ message: 'id hoặc imageId không hợp lệ' });
    return;
  }

  try {
    await deleteProductImageService(id, imageId);
    res.status(200).json({ message: 'Xóa ảnh sản phẩm thành công' });
  } catch (error: unknown) {
    handleError(error, res);
  }
};
