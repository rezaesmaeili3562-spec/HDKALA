import { useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useStore } from '../store/useStore';
import ProductCard from '../components/ProductCard';
import ProductGridSkeleton from '../components/ProductSkeleton';
import EmptyState from '../components/EmptyState';
import { HeartIcon } from '../components/Icons';
import { toFa } from '../utils/format';

// ---------- صفحه علاقه‌مندی‌ها ----------
export default function WishlistPage() {
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const wishlist = useStore((s) => s.wishlist);

  const items = (products || []).filter((p) => wishlist.includes(p.id));

  return (
    <div className="page-enter container-page py-8">
      <h1 className="mb-6 text-2xl font-extrabold text-slate-900 dark:text-white">
        علاقه‌مندی‌های من ({toFa(wishlist.length)})
      </h1>
      {loading ? (
        <ProductGridSkeleton count={4} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<HeartIcon size={30} />}
          title="لیست علاقه‌مندی‌ها خالی است"
          description="با کلیک روی قلب محصولات، آن‌ها را اینجا نگه دارید."
          actionLabel="مشاهده محصولات"
          onAction={() => navigate('/products')}
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
