import { fetchFeaturedProducts, fetchBlogs, formatPrice } from '../../../shared/js/api.js';
import { showNotification } from '../../../shared/js/ui.js';

function createProductCard(product) {
  return `
    <article class="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div class="relative h-44 w-full overflow-hidden">
        <img src="${product.image}" alt="${product.name}" class="h-full w-full object-cover" loading="lazy" />
        <span class="absolute end-3 top-3 inline-flex items-center rounded-full bg-indigo-600/90 px-3 py-1 text-xs font-semibold text-white">${product.badge}</span>
      </div>
      <div class="flex flex-1 flex-col gap-3 p-5">
        <div class="space-y-1">
          <h3 class="text-base font-semibold text-slate-900">${product.name}</h3>
          <p class="text-sm text-slate-600">${product.description}</p>
        </div>
        <div class="mt-auto flex items-center justify-between">
          <span class="text-sm font-semibold text-indigo-600">${formatPrice(product.price)}</span>
          <a href="#product/${product.id}" class="text-sm font-semibold text-indigo-600 transition hover:text-indigo-500">جزئیات</a>
        </div>
      </div>
    </article>
  `;
}

function createBlogCard(blog) {
  return `
    <article class="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div class="space-y-2">
        <time class="text-xs font-medium text-slate-400">${blog.date}</time>
        <h3 class="text-base font-semibold text-slate-900">${blog.title}</h3>
        <p class="text-sm text-slate-600">${blog.excerpt}</p>
      </div>
      <a href="#blog" class="mt-4 text-sm font-semibold text-indigo-600 transition hover:text-indigo-500">ادامه مطلب</a>
    </article>
  `;
}

export default async function homeController(root) {
  const featuredList = root.querySelector('[data-featured-list]');
  const blogList = root.querySelector('[data-blog-list]');

  try {
    const [featuredProducts, blogPosts] = await Promise.all([
      fetchFeaturedProducts(),
      fetchBlogs()
    ]);

    if (featuredList) {
      featuredList.innerHTML = featuredProducts.map(createProductCard).join('');
    }

    if (blogList) {
      blogList.innerHTML = blogPosts.map(createBlogCard).join('');
    }
  } catch (error) {
    console.error('Failed to load home data', error);
    showNotification('خطا در دریافت اطلاعات صفحه اصلی', 'danger');
  }
}
