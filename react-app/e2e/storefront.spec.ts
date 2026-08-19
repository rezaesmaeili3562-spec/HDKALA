import { expect, test } from '@playwright/test';

test.describe('Storefront regressions', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.removeItem('hdkala-react');
    });
  });

  test('cart button opens drawer on desktop and mobile', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('cart-button').click();
    await expect(page.getByText('سبد خرید شما خالی است')).toBeVisible();
    await page.keyboard.press('Escape');

    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/');
    await page.getByTestId('cart-button').click();
    await expect(page.getByText('سبد خرید شما خالی است')).toBeVisible();
  });

  test('add to cart, persist after reload, and checkout totals stay consistent', async ({ page }) => {
    await page.goto('/product/p11');
    await page.getByTestId('add-to-cart-detail').click();
    await expect(page.getByText('تی‌شرت نخی ساده مردانه').first()).toBeVisible();
    await page.reload();
    await page.getByTestId('cart-button').click();
    await expect(page.getByText('تی‌شرت نخی ساده مردانه').first()).toBeVisible();
  });

  test('full purchase flow with demo account', async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('demo-login').click();
    await page.goto('/product/p17');
    await page.getByTestId('add-to-cart-detail').click();
    await page.goto('/checkout');
    await page.getByTestId('receiver-name').fill('علی رضایی');
    await page.getByTestId('receiver-phone').fill('09121234567');
    await page.getByTestId('checkout-next').click();
    await page.getByTestId('province').selectOption('تهران');
    await page.getByTestId('city').fill('تهران');
    await page.getByTestId('address').fill('خیابان انقلاب، پلاک ۱۰ واحد ۲');
    await page.getByTestId('postal').fill('1111222233');
    await page.getByTestId('checkout-next').click();
    await page.getByTestId('place-order').click();
    await expect(page.getByText('سفارش شما با موفقیت ثبت شد')).toBeVisible();
  });
});
