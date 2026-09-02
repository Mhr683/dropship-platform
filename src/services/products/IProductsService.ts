import { Product } from '../../types';
import {
  ApiResponse,
  PaginatedResponse,
  ProductFilterParams,
  CreateProductDTO,
  UpdateProductDTO,
  ProductStockUpdateDTO
} from '../types/api.types';

/**
 * Service Contract for Products Module
 * Replicates future production REST endpoints:
 * - GET /api/v1/products
 * - GET /api/v1/products/:id
 * - GET /api/v1/products/sku/:sku
 * - POST /api/v1/products
 * - PUT /api/v1/products/:id
 * - DELETE /api/v1/products/:id
 * - PATCH /api/v1/products/:id/stock
 * - POST /api/v1/products/bulk-import
 * - GET /api/v1/products/categories
 * - GET /api/v1/products/trending
 * - GET /api/v1/products/best-sellers
 */
export interface IProductsService {
  getProducts(params?: ProductFilterParams): Promise<PaginatedResponse<Product>>;
  getProductById(id: string): Promise<ApiResponse<Product>>;
  getProductBySku(sku: string): Promise<ApiResponse<Product>>;
  createProduct(dto: CreateProductDTO): Promise<ApiResponse<Product>>;
  updateProduct(id: string, dto: UpdateProductDTO): Promise<ApiResponse<Product>>;
  deleteProduct(id: string): Promise<ApiResponse<{ deleted: boolean; id: string }>>;
  adjustStock(id: string, dto: ProductStockUpdateDTO): Promise<ApiResponse<Product>>;
  bulkImportProducts(products: CreateProductDTO[]): Promise<ApiResponse<{ importedCount: number; products: Product[] }>>;
  getCategories(): Promise<ApiResponse<string[]>>;
  getTrendingProducts(limit?: number): Promise<ApiResponse<Product[]>>;
  getBestSellers(limit?: number): Promise<ApiResponse<Product[]>>;
}
