export function validateLogin({ email, password }) {
  const errors = {};
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'ایمیل معتبر نیست';
  }
  if (!password || password.length < 6) {
    errors.password = 'رمز عبور باید حداقل ۶ کاراکتر باشد';
  }
  return errors;
}

export function validateSignup({ email, password, name }) {
  const errors = validateLogin({ email, password });
  if (!name || name.trim().length < 3) {
    errors.name = 'نام باید حداقل ۳ کاراکتر باشد';
  }
  return errors;
}

export function validateAddress({ city, province, address }) {
  const errors = {};
  if (!province) {
    errors.province = 'استان را انتخاب کنید';
  }
  if (!city) {
    errors.city = 'شهر را انتخاب کنید';
  }
  if (!address || address.trim().length < 10) {
    errors.address = 'نشانی باید حداقل ۱۰ کاراکتر باشد';
  }
  return errors;
}
