import { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { faDate, faNum } from '../../utils/format';
import Button from '../../components/Button';
import RatingStars from '../../components/RatingStars';
import type { ProductComment } from '../../types';

export default function AdminCommentsPage() {
  const commentsMap = useStore((s) => s.comments);
  const products = useStore((s) => s.products);
  const approveComment = useStore((s) => s.approveComment);
  const deleteComment = useStore((s) => s.deleteComment);

  const comments = useMemo(() => {
    const list: ProductComment[] = [];
    Object.values(commentsMap).forEach((arr) => list.push(...arr));
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [commentsMap]);

  const productName = (id: string) => products.find((p) => p.id === id)?.name || id;

  return (
    <div className="page-enter space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">مدیریت نظرات</h1>
        <p className="mt-1 text-sm text-slate-500">{faNum(comments.length)} دیدگاه</p>
      </div>

      {comments.length === 0 ? (
        <div className="card py-16 text-center text-sm text-slate-400">دیدگاهی برای بررسی وجود ندارد.</div>
      ) : (
        <ul className="space-y-3">
          {comments.map((c) => (
            <li key={c.id} className="card space-y-3 p-5" data-testid={`admin-comment-${c.id}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-100">{c.name}</p>
                  <p className="text-xs text-slate-400">
                    {productName(c.productId)} · {faDate(c.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <RatingStars rating={c.rating} showCount={false} />
                  <span className={`rounded-lg px-2 py-1 text-xs font-bold ${c.approved ? 'bg-emerald-500/15 text-emerald-600' : 'bg-amber-500/15 text-amber-600'}`}>
                    {c.approved ? 'تأییدشده' : 'در انتظار تأیید'}
                  </span>
                </div>
              </div>
              <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{c.text}</p>
              <div className="flex gap-2">
                {!c.approved && (
                  <Button type="button" size="sm" onClick={() => approveComment(c.id)} data-testid={`approve-comment-${c.id}`}>
                    تأیید
                  </Button>
                )}
                <Button type="button" size="sm" variant="danger" onClick={() => deleteComment(c.id)}>
                  حذف
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
