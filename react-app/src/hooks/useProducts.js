import { useEffect, useState } from 'react';
import { useStore, selectCatalog } from '../store/useStore';

// هوک دریافت محصولات از استور مشترک (ادمین + فروشگاه)
export function useProducts() {
  const products = useStore(selectCatalog);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 280);
    return () => clearTimeout(t);
  }, []);

  return { products: ready ? products : null, loading: !ready, error: null };
}
