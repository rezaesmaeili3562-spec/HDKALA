// لایه سرویس داده — فعلاً از فایل JSON محلی خوانده می‌شود؛
// برای اتصال به API واقعی کافیست این دو تابع را با fetch جایگزین کنید.
import productsData from '../data/products.json';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getProducts() {
  await delay(350);
  return [...productsData];
}

export async function getProductById(id) {
  await delay(250);
  const product = productsData.find((p) => p.id === id);
  if (!product) {
    throw new Error('PRODUCT_NOT_FOUND');
  }
  return { ...product };
}

export async function getRelatedProducts(product, limit = 4) {
  const all = await getProducts();
  return all
    .filter((p) => p.category === product.category && p.id !== product.id)
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
}
