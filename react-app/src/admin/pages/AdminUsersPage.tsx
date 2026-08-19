import { useMemo, useState } from 'react';
import { useStore } from '../../store/useStore';
import { faDate, faNum } from '../../utils/format';
import Button from '../../components/Button';

export default function AdminUsersPage() {
  const users = useStore((s) => s.users);
  const setUserDisabled = useStore((s) => s.setUserDisabled);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => `${u.name} ${u.phone} ${u.email}`.toLowerCase().includes(q));
  }, [users, query]);

  return (
    <div className="page-enter space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">مدیریت کاربران</h1>
        <p className="mt-1 text-sm text-slate-500">{faNum(filtered.length)} کاربر</p>
      </div>

      <div className="card p-4">
        <input
          className="input-base"
          placeholder="جستجو نام، موبایل یا ایمیل…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          data-testid="admin-user-search"
        />
      </div>

      <div className="card overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3 text-start font-medium">کاربر</th>
              <th className="px-4 py-3 text-start font-medium">موبایل</th>
              <th className="px-4 py-3 text-start font-medium">ایمیل</th>
              <th className="px-4 py-3 text-start font-medium">عضویت</th>
              <th className="px-4 py-3 text-start font-medium">وضعیت</th>
              <th className="px-4 py-3 text-start font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((user) => (
              <tr key={user.id} data-testid={`admin-user-row-${user.id}`}>
                <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-100">{user.name}</td>
                <td className="px-4 py-3" dir="ltr">
                  {user.phone}
                </td>
                <td className="px-4 py-3 text-slate-500">{user.email || '—'}</td>
                <td className="px-4 py-3 text-slate-500">{user.createdAt ? faDate(user.createdAt) : '—'}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-bold ${user.disabled ? 'text-rose-500' : 'text-emerald-600'}`}>
                    {user.disabled ? 'غیرفعال' : 'فعال'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Button
                    type="button"
                    size="sm"
                    variant={user.disabled ? 'outline' : 'danger'}
                    onClick={() => setUserDisabled(user.id, !user.disabled)}
                    data-testid={`user-toggle-${user.id}`}
                  >
                    {user.disabled ? 'فعال‌سازی' : 'غیرفعال‌سازی'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="py-10 text-center text-sm text-slate-400">کاربری پیدا نشد.</p>}
      </div>
    </div>
  );
}
