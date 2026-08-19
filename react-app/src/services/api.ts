import { useStore, selectCatalog } from '../store/useStore';
import type { Product } from '../types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getProducts(): Promise<Product[]> {
  await delay(280);
  return [...selectCatalog(useStore.getState())];
}

export async function getProductById(id: string): Promise<Product> {
  await delay(180);
  const product = selectCatalog(useStore.getState()).find((p) => p.id === id);
  if (!product) {
    throw new Error('PRODUCT_NOT_FOUND');
  }
  return { ...product };
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const all = await getProducts();
  return all
    .filter((p) => p.category === product.category && p.id !== product.id)
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
}
