import { expect, test, type Page } from '@playwright/test';

async function loginAdmin(page: Page) {
  await page.goto('/admin/login');
  await page.getByTestId('admin-username').fill('admin');
  await page.getByTestId('admin-password').fill('admin1234');
  await page.getByTestId('admin-login-submit').click();
  await expect(page.getByRole('heading', { name: 'داشبورد' })).toBeVisible();
}

async function loginDemoCustomer(page: Page) {
  await page.goto('/login');
  await page.getByTestId('demo-login').click();
  await expect(page.getByText('کاربر دمو').first()).toBeVisible();
}

test.describe('Admin panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.removeItem('hdkala-react');
    });
  });

  test('admin button is visible and works at 360/768/1024/1440', async ({ page }) => {
    for (const width of [360, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');
      const link = page.getByTestId('admin-panel-link');
      await expect(link).toBeVisible();
      await link.click();
      await expect(page).toHaveURL(/\/admin\/login/);
      await expect(page.getByRole('heading', { name: 'ورود به پنل مدیریت' })).toBeVisible();
    }
  });

  test('guest is redirected from protected admin routes', async ({ page }) => {
    await page.goto('/admin/products');
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test('demo admin login and logout work', async ({ page }) => {
    await loginAdmin(page);
    await page.getByTestId('admin-logout').click();
    await expect(page).toHaveURL(/\/admin\/login/);
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test('new product created in admin appears instantly in storefront search', async ({ page }) => {
    await loginAdmin(page);
    await page.getByTestId('admin-nav-products').click();
    await page.getByTestId('admin-add-product').click();
    await page.getByTestId('product-name').fill('هدفون تست ادمین HDK');
    await page.getByTestId('product-brand').fill('HDK Test');
    await page.getByTestId('product-price').fill('2500000');
    await page.getByTestId('product-discount').fill('10');
    await page.getByTestId('product-stock').fill('7');
    await page.getByTestId('product-desc').fill('محصول آزمایشی پنل مدیریت برای بررسی همگام‌سازی فروشگاه.');
    await page.getByTestId('product-save').click();
    await expect(page.getByText('هدفون تست ادمین HDK')).toBeVisible();

    await page.goto('/products?q=هدفون تست ادمین');
    await expect(page.getByRole('link', { name: /هدفون تست ادمین HDK/ })).toBeVisible();
  });

  test('order status change in admin is visible on user profile', async ({ page }) => {
    await loginDemoCustomer(page);
    await page.goto('/product/p11');
    await expect(page.getByTestId('add-to-cart-detail')).toBeVisible();
    await page.getByTestId('add-to-cart-detail').click();
    await page.goto('/checkout');
    await page.getByTestId('receiver-name').fill('کاربر دمو');
    await page.getByTestId('receiver-phone').fill('09120000000');
    await page.getByTestId('checkout-next').click();
    await page.getByTestId('province').selectOption('تهران');
    await page.getByTestId('city').fill('تهران');
    await page.getByTestId('address').fill('خیابان ولیعصر، پلاک ۱۲۳ واحد ۴');
    await page.getByTestId('postal').fill('1234567890');
    await page.getByTestId('checkout-next').click();
    await page.getByTestId('place-order').click();
    await expect(page.getByText('سفارش شما با موفقیت ثبت شد')).toBeVisible();
    const orderCode = (await page.getByTestId('order-id').textContent()) || '';
    expect(orderCode).toMatch(/HDK-\d+/);

    await loginAdmin(page);
    await page.getByTestId('admin-nav-orders').click();
    await expect(page.getByText(orderCode)).toBeVisible();
    await page.getByTestId(`order-status-${orderCode}`).selectOption('ارسال‌شده');

    await page.goto('/profile');
    await expect(page.getByTestId(`profile-order-status-${orderCode}`)).toHaveText('ارسال‌شده');
  });

  test('unapproved comments stay hidden on product page', async ({ page }) => {
    await page.goto('/product/p01');
    await expect(page.getByTestId('comments-empty')).toBeVisible();
    await page.getByTestId('comment-text').fill('این دیدگاه هنوز نباید در فروشگاه دیده شود.');
    await page.getByTestId('comment-submit').click();
    await expect(page.getByTestId('comments-empty')).toBeVisible();
    await expect(page.getByText('این دیدگاه هنوز نباید در فروشگاه دیده شود.')).toHaveCount(0);

    await loginAdmin(page);
    await page.getByTestId('admin-nav-comments').click();
    await expect(page.getByText('این دیدگاه هنوز نباید در فروشگاه دیده شود.')).toBeVisible();
    await page.getByRole('button', { name: 'تأیید' }).click();

    await page.goto('/product/p01');
    await expect(page.getByText('این دیدگاه هنوز نباید در فروشگاه دیده شود.')).toBeVisible();
  });

  test('coupon applies to checkout total', async ({ page }) => {
    await loginDemoCustomer(page);
    await page.goto('/product/p11');
    await page.getByTestId('add-to-cart-detail').click();
    await page.goto('/checkout');
    await page.getByTestId('coupon-input').fill('WELCOME10');
    await page.getByTestId('apply-coupon').click();
    await expect(page.getByTestId('coupon-discount-row')).toBeVisible();
    await expect(page.getByTestId('checkout-total')).toContainText('تومان');
  });
});
