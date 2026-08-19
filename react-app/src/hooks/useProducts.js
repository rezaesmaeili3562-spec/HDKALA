import { useEffect, useState } from 'react';
import { getProducts } from '../services/api';

// هوک دریافت محصولات با مدیریت وضعیت لودینگ و خطا
export function useProducts() {
  const [products, setProducts] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    getProducts()
      .then((data) => {
        if (active) setProducts(data);
      })
      .catch((e) => {
        if (active) setError(e);
      });
    return () => {
      active = false;
    };
  }, []);

  return { products, loading: !products && !error, error };
}
