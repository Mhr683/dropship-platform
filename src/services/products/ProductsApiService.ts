import { Product } from '../../types';
import {
  ApiResponse,
  PaginatedResponse,
  ProductFilterParams,
  CreateProductDTO,
  UpdateProductDTO,
  ProductStockUpdateDTO
} from '../types/api.types';
import { IProductsService } from './IProductsService';
import { HttpClient } from '../client/HttpClient';

/**
 * Production REST HTTP Client Implementation for Products
 * Communicates with backend endpoints: /api/v1/products
 */
export class ProductsApiService implements IProductsService {
  constructor(private client: HttpClient) {}

  public async getProducts(params?: ProductFilterParams): Promise<PaginatedResponse<Product>> {
    const res = await this.client.get<any>('/products', params);
    return res as unknown as PaginatedResponse<Product>;
  }

  public async getProductById(id: string): Promise<ApiResponse<Product>> {
    return this.client.get<Product>(`/products/${id}`);
  }

  public async getProductBySku(sku: string): Promise<ApiResponse<Product>> {
    return this.client.get<Product>(`/products/sku/${sku}`);
  }

  public async createProduct(dto: CreateProductDTO): Promise<ApiResponse<Product>> {
    return this.client.post<Product>('/products', dto);
  }

  public async updateProduct(id: string, dto: UpdateProductDTO): Promise<ApiResponse<Product>> {
    return this.client.put<Product>(`/products/${id}`, dto);
  }

  public async deleteProduct(id: string): Promise<ApiResponse<{ deleted: boolean; id: string }>> {
    return this.client.delete<{ deleted: boolean; id: string }>(`/products/${id}`);
  }

  public async adjustStock(id: string, dto: ProductStockUpdateDTO): Promise<ApiResponse<Product>> {
    return this.client.patch<Product>(`/products/${id}/stock`, dto);
  }

  public async bulkImportProducts(products: CreateProductDTO[]): Promise<ApiResponse<{ importedCount: number; products: Product[] }>> {
    return this.client.post<{ importedCount: number; products: Product[] }>('/products/bulk-import', { products });
  }

  public async getCategories(): Promise<ApiResponse<string[]>> {
    return this.client.get<string[]>('/products/categories');
  }

  public async getTrendingProducts(limit: number = 6): Promise<ApiResponse<Product[]>> {
    return this.client.get<Product[]>('/products/trending', { limit });
  }

  public async getBestSellers(limit: number = 6): Promise<ApiResponse<Product[]>> {
    return this.client.get<Product[]>('/products/best-sellers', { limit });
  }
}
