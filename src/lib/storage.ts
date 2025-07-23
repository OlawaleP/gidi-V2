import { Product } from '@/types/product';
import { STORAGE_KEYS } from './constants';
import { generateId } from './utils';

export class StorageManager {
  private static instance: StorageManager;

  private constructor() {}

  public static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  private isLocalStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  private getItem<T>(key: string, defaultValue: T): T {
    if (!this.isLocalStorageAvailable()) {
      return defaultValue;
    }

    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage:`, error);
      return defaultValue;
    }
  }

  private setItem<T>(key: string, value: T): boolean {
    if (!this.isLocalStorageAvailable()) {
      return false;
    }

    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage:`, error);
      return false;
    }
  }

  public getProducts(): Product[] {
    return this.getItem<Product[]>(STORAGE_KEYS.PRODUCTS, []);
  }

  public saveProducts(products: Product[]): boolean {
    return this.setItem(STORAGE_KEYS.PRODUCTS, products);
  }

  public getProduct(id: string): Product | null {
    const products = this.getProducts();
    return products.find(product => product.id === id) || null;
  }

  public addProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const products = this.getProducts();
    const now = new Date().toISOString();
    
    const newProduct: Product = {
      ...productData,
      id: generateId(),
      createdAt: now,
      updatedAt: now
    };

    products.push(newProduct);
    this.saveProducts(products);
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Omit<Product, 'id' | 'createdAt'>>): Product | null {
    const products = this.getProducts();
    const productIndex = products.findIndex(product => product.id === id);

    if (productIndex === -1) {
      return null;
    }

    const updatedProduct: Product = {
      ...products[productIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    products[productIndex] = updatedProduct;
    this.saveProducts(products);
    return updatedProduct;
  }

  public deleteProduct(id: string): boolean {
    const products = this.getProducts();
    const filteredProducts = products.filter(product => product.id !== id);
    
    if (filteredProducts.length === products.length) {
      return false; 
    }

    return this.saveProducts(filteredProducts);
  }

  public productExists(id: string): boolean {
    const products = this.getProducts();
    return products.some(product => product.id === id);
  }

  public clearProducts(): boolean {
    return this.setItem(STORAGE_KEYS.PRODUCTS, []);
  }

  public getProductsCount(): number {
    return this.getProducts().length;
  }

  public importProducts(newProducts: Product[]): boolean {
    const existingProducts = this.getProducts();
    const existingIds = new Set(existingProducts.map(p => p.id));
    
    const uniqueNewProducts = newProducts.filter(p => !existingIds.has(p.id));
    
    const mergedProducts = [...existingProducts, ...uniqueNewProducts];
    return this.saveProducts(mergedProducts);
  }

  public exportProducts(): Product[] {
    return this.getProducts();
  }
}

export const storage = StorageManager.getInstance();

export const getStoredProducts = (): Product[] => {
  return storage.getProducts();
};

export const saveProducts = (products: Product[]): boolean => {
  return storage.saveProducts(products);
};