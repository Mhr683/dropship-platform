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
import { HttpClient, ApiException } from '../client/HttpClient';
import { mockDataStore } from '../mock/mockStore';

export class ProductsMockService implements IProductsService {
  constructor(private client: HttpClient) {}

  public async getProducts(params: ProductFilterParams = {}): Promise<PaginatedResponse<Product>> {
    const startTime = Date.now();
    await this.client.simulateNetworkLatency();

    let allProducts = mockDataStore.getProducts();

    // 1. Text Search Filtering (name, SKU, description, category, supplierName)
    if (params.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      allProducts = allProducts.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.supplierName.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // 2. Category Filter
    if (params.category && params.category !== 'All Categories' && params.category !== 'ALL') {
      allProducts = allProducts.filter(
        p => p.category.toLowerCase() === params.category!.toLowerCase()
      );
    }

    // 3. Status Filter
    if (params.status) {
      allProducts = allProducts.filter(p => p.status === params.status);
    }

    // 4. Supplier Filter
    if (params.supplierId) {
      allProducts = allProducts.filter(p => p.supplierId === params.supplierId);
    }

    // 5. Price Bounds
    if (params.minPrice !== undefined) {
      allProducts = allProducts.filter(p => p.supplierCostPKR >= params.minPrice!);
    }
    if (params.maxPrice !== undefined) {
      allProducts = allProducts.filter(p => p.supplierCostPKR <= params.maxPrice!);
    }

    // 6. Flags
    if (params.isTrending !== undefined) {
      allProducts = allProducts.filter(p => p.isTrending === params.isTrending);
    }
    if (params.isBestSeller !== undefined) {
      allProducts = allProducts.filter(p => p.isBestSeller === params.isBestSeller);
    }
    if (params.competitionLevel) {
      allProducts = allProducts.filter(p => p.competitionLevel === params.competitionLevel);
    }
    if (params.minStock !== undefined) {
      allProducts = allProducts.filter(p => p.stock >= params.minStock!);
    }

    // 7. Sorting
    const sortBy = params.sortBy || 'createdAt';
    const sortOrder = params.sortOrder || 'desc';

    allProducts.sort((a, b) => {
      let valA: any = (a as any)[sortBy] ?? 0;
      let valB: any = (b as any)[sortBy] ?? 0;

      if (typeof valA === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });

    // 8. Pagination
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, Math.min(100, params.limit || 20));
    const total = allProducts.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedItems = allProducts.slice(startIndex, startIndex + limit);

    const response: PaginatedResponse<Product> = {
      success: true,
      data: paginatedItems,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      message: `Retrieved ${paginatedItems.length} products successfully.`,
      statusCode: 200,
      timestamp: new Date().toISOString(),
      filtersApplied: params
    };

    this.client.recordMockTelemetry(
      'GET',
      '/api/v1/products',
      params,
      null,
      200,
      response,
      Date.now() - startTime
    );

    return response;
  }

  public async getProductById(id: string): Promise<ApiResponse<Product>> {
    const startTime = Date.now();
    await this.client.simulateNetworkLatency();

    const product = mockDataStore.getProducts().find(p => p.id === id);
    if (!product) {
      const notFoundError = {
        success: false as const,
        errorCode: 'PRODUCT_NOT_FOUND',
        message: `Product with ID "${id}" was not found in catalog.`,
        statusCode: 404,
        timestamp: new Date().toISOString()
      };
      this.client.recordMockTelemetry('GET', `/api/v1/products/${id}`, undefined, null, 404, notFoundError, Date.now() - startTime);
      throw new ApiException(notFoundError);
    }

    const response: ApiResponse<Product> = {
      success: true,
      data: product,
      message: 'Product retrieved successfully.',
      statusCode: 200,
      timestamp: new Date().toISOString()
    };

    this.client.recordMockTelemetry('GET', `/api/v1/products/${id}`, undefined, null, 200, response, Date.now() - startTime);
    return response;
  }

  public async getProductBySku(sku: string): Promise<ApiResponse<Product>> {
    const startTime = Date.now();
    await this.client.simulateNetworkLatency();

    const product = mockDataStore.getProducts().find(p => p.sku.toLowerCase() === sku.toLowerCase());
    if (!product) {
      const notFoundError = {
        success: false as const,
        errorCode: 'SKU_NOT_FOUND',
        message: `Product with SKU "${sku}" was not found.`,
        statusCode: 404,
        timestamp: new Date().toISOString()
      };
      this.client.recordMockTelemetry('GET', `/api/v1/products/sku/${sku}`, undefined, null, 404, notFoundError, Date.now() - startTime);
      throw new ApiException(notFoundError);
    }

    const response: ApiResponse<Product> = {
      success: true,
      data: product,
      message: 'Product found by SKU.',
      statusCode: 200,
      timestamp: new Date().toISOString()
    };

    this.client.recordMockTelemetry('GET', `/api/v1/products/sku/${sku}`, undefined, null, 200, response, Date.now() - startTime);
    return response;
  }

  public async createProduct(dto: CreateProductDTO): Promise<ApiResponse<Product>> {
    const startTime = Date.now();
    await this.client.simulateNetworkLatency();

    // Validation
    if (!dto.name || !dto.category || !dto.supplierCostPKR) {
      const badReq = {
        success: false as const,
        errorCode: 'VALIDATION_ERROR',
        message: 'Product name, category, and supplier cost are required fields.',
        statusCode: 400,
        timestamp: new Date().toISOString()
      };
      this.client.recordMockTelemetry('POST', '/api/v1/products', undefined, dto, 400, badReq, Date.now() - startTime);
      throw new ApiException(badReq);
    }

    const generatedSku = dto.sku || `YM-${dto.category.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newProduct: Product = {
      id: 'prod-' + Date.now(),
      sku: generatedSku,
      name: dto.name,
      category: dto.category,
      supplierId: dto.supplierId || 'sup-1',
      supplierName: dto.supplierName || 'Shah Alam Wholesale Hub',
      supplierCostPKR: Number(dto.supplierCostPKR),
      recSellingPricePKR: Number(dto.recSellingPricePKR || dto.supplierCostPKR * 1.4),
      stock: Number(dto.stock ?? 25),
      ownerRole: dto.ownerRole || 'SUPPLIER',
      image: dto.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      rating: 4.8,
      reviewsCount: 12,
      salesPotentialScore: 85,
      fastShipping: dto.fastShipping ?? true,
      estDeliveryDays: dto.estDeliveryDays ?? 2,
      estShippingCostPKR: dto.estShippingCostPKR ?? 220,
      description: dto.description || '',
      variants: dto.variants,
      status: Number(dto.stock) > 5 ? 'IN_STOCK' : Number(dto.stock) > 0 ? 'LOW_STOCK' : 'OUT_OF_STOCK',
      lowStockThreshold: dto.lowStockThreshold ?? 5,
      competitionLevel: dto.competitionLevel || 'MEDIUM',
      isTrending: dto.isTrending ?? false,
      isBestSeller: dto.isBestSeller ?? false,
      createdAt: new Date().toISOString()
    };

    mockDataStore.addProduct(newProduct);

    const response: ApiResponse<Product> = {
      success: true,
      data: newProduct,
      message: `Product "${newProduct.name}" created successfully.`,
      statusCode: 201,
      timestamp: new Date().toISOString()
    };

    this.client.recordMockTelemetry('POST', '/api/v1/products', undefined, dto, 201, response, Date.now() - startTime);
    return response;
  }

  public async updateProduct(id: string, dto: UpdateProductDTO): Promise<ApiResponse<Product>> {
    const startTime = Date.now();
    await this.client.simulateNetworkLatency();

    const existing = mockDataStore.getProducts().find(p => p.id === id);
    if (!existing) {
      const err = {
        success: false as const,
        errorCode: 'PRODUCT_NOT_FOUND',
        message: `Cannot update. Product ID "${id}" does not exist.`,
        statusCode: 404,
        timestamp: new Date().toISOString()
      };
      this.client.recordMockTelemetry('PUT', `/api/v1/products/${id}`, undefined, dto, 404, err, Date.now() - startTime);
      throw new ApiException(err);
    }

    const updated = mockDataStore.updateProduct(id, dto as Partial<Product>);

    const response: ApiResponse<Product> = {
      success: true,
      data: updated!,
      message: `Product "${updated!.name}" updated successfully.`,
      statusCode: 200,
      timestamp: new Date().toISOString()
    };

    this.client.recordMockTelemetry('PUT', `/api/v1/products/${id}`, undefined, dto, 200, response, Date.now() - startTime);
    return response;
  }

  public async deleteProduct(id: string): Promise<ApiResponse<{ deleted: boolean; id: string }>> {
    const startTime = Date.now();
    await this.client.simulateNetworkLatency();

    const success = mockDataStore.deleteProduct(id);
    if (!success) {
      const err = {
        success: false as const,
        errorCode: 'PRODUCT_NOT_FOUND',
        message: `Product with ID "${id}" was not found.`,
        statusCode: 404,
        timestamp: new Date().toISOString()
      };
      this.client.recordMockTelemetry('DELETE', `/api/v1/products/${id}`, undefined, null, 404, err, Date.now() - startTime);
      throw new ApiException(err);
    }

    const response: ApiResponse<{ deleted: boolean; id: string }> = {
      success: true,
      data: { deleted: true, id },
      message: 'Product deleted from catalog.',
      statusCode: 200,
      timestamp: new Date().toISOString()
    };

    this.client.recordMockTelemetry('DELETE', `/api/v1/products/${id}`, undefined, null, 200, response, Date.now() - startTime);
    return response;
  }

  public async adjustStock(id: string, dto: ProductStockUpdateDTO): Promise<ApiResponse<Product>> {
    const startTime = Date.now();
    await this.client.simulateNetworkLatency();

    const product = mockDataStore.getProducts().find(p => p.id === id);
    if (!product) {
      const err = {
        success: false as const,
        errorCode: 'PRODUCT_NOT_FOUND',
        message: `Product with ID "${id}" not found.`,
        statusCode: 404,
        timestamp: new Date().toISOString()
      };
      this.client.recordMockTelemetry('PATCH', `/api/v1/products/${id}/stock`, undefined, dto, 404, err, Date.now() - startTime);
      throw new ApiException(err);
    }

    let newStock = product.stock;
    if (dto.operation === 'SET') {
      newStock = Math.max(0, dto.stockChange);
    } else if (dto.operation === 'INCREMENT') {
      newStock += dto.stockChange;
    } else if (dto.operation === 'DECREMENT') {
      newStock = Math.max(0, newStock - dto.stockChange);
    }

    const newStatus =
      newStock === 0 ? 'OUT_OF_STOCK' : newStock <= product.lowStockThreshold ? 'LOW_STOCK' : 'IN_STOCK';

    const updated = mockDataStore.updateProduct(id, { stock: newStock, status: newStatus });

    const response: ApiResponse<Product> = {
      success: true,
      data: updated!,
      message: `Stock updated to ${newStock} (${dto.reason || 'Inventory adjustment'}).`,
      statusCode: 200,
      timestamp: new Date().toISOString()
    };

    this.client.recordMockTelemetry('PATCH', `/api/v1/products/${id}/stock`, undefined, dto, 200, response, Date.now() - startTime);
    return response;
  }

  public async bulkImportProducts(products: CreateProductDTO[]): Promise<ApiResponse<{ importedCount: number; products: Product[] }>> {
    const startTime = Date.now();
    await this.client.simulateNetworkLatency();

    const createdList: Product[] = [];
    products.forEach((dto, index) => {
      const newP: Product = {
        id: `prod-bulk-${Date.now()}-${index}`,
        sku: dto.sku || `YM-BULK-${Math.floor(1000 + Math.random() * 9000)}`,
        name: dto.name,
        category: dto.category || 'General',
        supplierId: dto.supplierId || 'sup-bulk',
        supplierName: dto.supplierName || 'Imported Wholesale',
        supplierCostPKR: Number(dto.supplierCostPKR),
        recSellingPricePKR: Number(dto.recSellingPricePKR || dto.supplierCostPKR * 1.4),
        stock: Number(dto.stock || 20),
        ownerRole: dto.ownerRole || 'SUPPLIER',
        image: dto.image || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80',
        rating: 4.7,
        salesPotentialScore: 80,
        fastShipping: true,
        estDeliveryDays: 2,
        estShippingCostPKR: 220,
        description: dto.description || 'Imported bulk wholesale item',
        status: 'IN_STOCK',
        lowStockThreshold: 5,
        competitionLevel: 'MEDIUM',
        isTrending: false,
        isBestSeller: false,
        createdAt: new Date().toISOString()
      };
      createdList.push(newP);
      mockDataStore.addProduct(newP);
    });

    const response: ApiResponse<{ importedCount: number; products: Product[] }> = {
      success: true,
      data: {
        importedCount: createdList.length,
        products: createdList
      },
      message: `Successfully imported ${createdList.length} products.`,
      statusCode: 201,
      timestamp: new Date().toISOString()
    };

    this.client.recordMockTelemetry('POST', '/api/v1/products/bulk-import', undefined, { count: products.length }, 201, response, Date.now() - startTime);
    return response;
  }

  public async getCategories(): Promise<ApiResponse<string[]>> {
    const startTime = Date.now();
    await this.client.simulateNetworkLatency();

    const products = mockDataStore.getProducts();
    const categoriesSet = new Set<string>();
    products.forEach(p => categoriesSet.add(p.category));

    const categories = Array.from(categoriesSet).sort();

    const response: ApiResponse<string[]> = {
      success: true,
      data: categories,
      message: `Retrieved ${categories.length} product categories.`,
      statusCode: 200,
      timestamp: new Date().toISOString()
    };

    this.client.recordMockTelemetry('GET', '/api/v1/products/categories', undefined, null, 200, response, Date.now() - startTime);
    return response;
  }

  public async getTrendingProducts(limit: number = 6): Promise<ApiResponse<Product[]>> {
    const startTime = Date.now();
    await this.client.simulateNetworkLatency();

    const trending = mockDataStore
      .getProducts()
      .filter(p => p.isTrending || p.salesPotentialScore >= 80)
      .slice(0, limit);

    const response: ApiResponse<Product[]> = {
      success: true,
      data: trending,
      message: 'Trending products fetched.',
      statusCode: 200,
      timestamp: new Date().toISOString()
    };

    this.client.recordMockTelemetry('GET', '/api/v1/products/trending', { limit }, null, 200, response, Date.now() - startTime);
    return response;
  }

  public async getBestSellers(limit: number = 6): Promise<ApiResponse<Product[]>> {
    const startTime = Date.now();
    await this.client.simulateNetworkLatency();

    const bestSellers = mockDataStore
      .getProducts()
      .filter(p => p.isBestSeller || p.rating >= 4.7)
      .slice(0, limit);

    const response: ApiResponse<Product[]> = {
      success: true,
      data: bestSellers,
      message: 'Best sellers fetched.',
      statusCode: 200,
      timestamp: new Date().toISOString()
    };

    this.client.recordMockTelemetry('GET', '/api/v1/products/best-sellers', { limit }, null, 200, response, Date.now() - startTime);
    return response;
  }
}
