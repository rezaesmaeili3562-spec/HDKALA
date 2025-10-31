import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const initialForm = {
  name: '',
  phone: '',
  email: '',
  password: ''
};

export default function RegisterForm({ open, onClose }) {
  const { registerUser } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  if (!open) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    setInfo('');

    if (!form.name.trim()) {
      setError('لطفا نام خود را وارد کنید.');
      return;
    }

    if (form.password.length < 6) {
      setError('رمز عبور باید حداقل ۶ کاراکتر باشد.');
      return;
    }

    try {
      registerUser(form);
      setInfo('ثبت‌نام شما با موفقیت انجام شد. اکنون می‌توانید خرید خود را آغاز کنید.');
      setForm(initialForm);
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleClose = () => {
    setForm(initialForm);
    setError('');
    setInfo('');
    onClose();
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div className="modal-header">
          <h2 className="modal-title">ثبت‌نام در اچ دی کالا</h2>
          <button type="button" className="close-btn" onClick={handleClose} aria-label="بستن">
            ×
          </button>
        </div>

        <form className="section-grid" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="registerName">نام و نام خانوادگی</label>
            <input
              id="registerName"
              name="name"
              type="text"
              placeholder="مثال: علی رضایی"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="registerPhone">شماره تماس</label>
            <input
              id="registerPhone"
              name="phone"
              type="tel"
              inputMode="tel"
              placeholder="09123456789"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="registerEmail">ایمیل</label>
            <input
              id="registerEmail"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="registerPassword">رمز عبور</label>
            <input
              id="registerPassword"
              name="password"
              type="password"
              placeholder="حداقل ۶ کاراکتر"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <span className="error-text">{error}</span>}
          {info && <span className="success-text">{info}</span>}

          <div className="form-actions">
            <button type="button" className="secondary-btn" onClick={handleClose}>
              انصراف
            </button>
            <button type="submit" className="btn btn-register">
              تکمیل ثبت‌نام
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
