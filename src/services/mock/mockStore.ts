import { Product, Order } from '../../types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from '../../data/mockData';

const PRODUCTS_STORAGE_KEY = 'ym_products';
const ORDERS_STORAGE_KEY = 'ym_orders';

type Listener<T> = (data: T) => void;

/**
 * Reactive in-memory and LocalStorage backed store for Mock Services
 */
class MockDataStore {
  private products: Product[] = [];
  private orders: Order[] = [];
  private productListeners: Set<Listener<Product[]>> = new Set();
  private orderListeners: Set<Listener<Order[]>> = new Set();

  constructor() {
    this.loadState();
  }

  private loadState(): void {
    try {
      const savedProds = typeof window !== 'undefined' ? localStorage.getItem(PRODUCTS_STORAGE_KEY) : null;
      this.products = savedProds ? JSON.parse(savedProds) : [...INITIAL_PRODUCTS];
    } catch {
      this.products = [...INITIAL_PRODUCTS];
    }

    try {
      const savedOrders = typeof window !== 'undefined' ? localStorage.getItem(ORDERS_STORAGE_KEY) : null;
      this.orders = savedOrders ? JSON.parse(savedOrders) : [...INITIAL_ORDERS];
    } catch {
      this.orders = [...INITIAL_ORDERS];
    }
  }

  // --- PRODUCTS ---
  public getProducts(): Product[] {
    return [...this.products];
  }

  public setProducts(newProducts: Product[]): void {
    this.products = newProducts;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(this.products));
      } catch (e) {
        console.warn('Failed to persist products to localStorage', e);
      }
    }
    this.notifyProductListeners();
  }

  public addProduct(product: Product): void {
    this.setProducts([product, ...this.products]);
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | null {
    let updatedProduct: Product | null = null;
    const nextProds = this.products.map(p => {
      if (p.id === id) {
        updatedProduct = { ...p, ...updates };
        return updatedProduct;
      }
      return p;
    });

    if (updatedProduct) {
      this.setProducts(nextProds);
    }
    return updatedProduct;
  }

  public deleteProduct(id: string): boolean {
    const prevLen = this.products.length;
    const nextProds = this.products.filter(p => p.id !== id);
    if (nextProds.length !== prevLen) {
      this.setProducts(nextProds);
      return true;
    }
    return false;
  }

  public subscribeProducts(listener: Listener<Product[]>): () => void {
    this.productListeners.add(listener);
    listener(this.getProducts());
    return () => this.productListeners.delete(listener);
  }

  private notifyProductListeners(): void {
    const list = this.getProducts();
    this.productListeners.forEach(l => l(list));
  }

  // --- ORDERS ---
  public getOrders(): Order[] {
    return [...this.orders];
  }

  public setOrders(newOrders: Order[]): void {
    this.orders = newOrders;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(this.orders));
      } catch (e) {
        console.warn('Failed to persist orders to localStorage', e);
      }
    }
    this.notifyOrderListeners();
  }

  public addOrder(order: Order): void {
    this.setOrders([order, ...this.orders]);
  }

  public updateOrder(orderId: string, updates: Partial<Order>): Order | null {
    let updatedOrder: Order | null = null;
    const nextOrders = this.orders.map(o => {
      if (o.orderId === orderId) {
        updatedOrder = { ...o, ...updates };
        return updatedOrder;
      }
      return o;
    });

    if (updatedOrder) {
      this.setOrders(nextOrders);
    }
    return updatedOrder;
  }

  public deleteOrder(orderId: string): boolean {
    const prevLen = this.orders.length;
    const nextOrders = this.orders.filter(o => o.orderId !== orderId);
    if (nextOrders.length !== prevLen) {
      this.setOrders(nextOrders);
      return true;
    }
    return false;
  }

  public subscribeOrders(listener: Listener<Order[]>): () => void {
    this.orderListeners.add(listener);
    listener(this.getOrders());
    return () => this.orderListeners.delete(listener);
  }

  private notifyOrderListeners(): void {
    const list = this.getOrders();
    this.orderListeners.forEach(l => l(list));
  }

  // Reset to initial
  public resetToDefault(): void {
    this.setProducts([...INITIAL_PRODUCTS]);
    this.setOrders([...INITIAL_ORDERS]);
  }
}

export const mockDataStore = new MockDataStore();
