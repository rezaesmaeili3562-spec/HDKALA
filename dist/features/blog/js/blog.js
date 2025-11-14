import { fetchBlogs } from '../../../shared/js/api.js';
import { showNotification } from '../../../shared/js/ui.js';

export default async function blogController(root) {
  const container = root.querySelector('[data-blog-list]');
  if (!container) return;

  try {
    const blogs = await fetchBlogs();
    container.innerHTML = blogs
      .map(
        (blog) => `
          <article class="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div class="space-y-3">
              <time class="text-xs font-medium text-slate-400">${blog.date}</time>
              <h2 class="text-lg font-semibold text-slate-900">${blog.title}</h2>
              <p class="text-sm text-slate-600">${blog.excerpt}</p>
            </div>
            <a href="#" class="mt-4 text-sm font-semibold text-indigo-600 transition hover:text-indigo-500">مطالعه کامل</a>
          </article>
        `
      )
      .join('');
  } catch (error) {
    console.error('Failed to load blogs', error);
    showNotification('خطا در بارگذاری بلاگ', 'danger');
  }
}
