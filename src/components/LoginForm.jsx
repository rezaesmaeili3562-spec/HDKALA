import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginForm({ open, onClose }) {
  const { requestOtp, verifyOtp, pendingOtp } = useAuth();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  if (!open) {
    return null;
  }

  const handleRequestOtp = (event) => {
    event.preventDefault();
    setError('');
    setInfo('');
    try {
      const generatedCode = requestOtp(phone);
      setStep(2);
      setInfo(`کد تایید برای شماره ${phone} ارسال شد. برای تست می‌توانید از کد ${generatedCode} استفاده کنید.`);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleVerifyOtp = (event) => {
    event.preventDefault();
    setError('');
    try {
      verifyOtp(otp);
      onClose();
      setPhone('');
      setOtp('');
      setStep(1);
      setInfo('');
    } catch (err) {
      setError(err.message);
    }
  };

  const resetStateAndClose = () => {
    setPhone('');
    setOtp('');
    setStep(1);
    setError('');
    setInfo('');
    onClose();
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div className="modal-header">
          <h2 className="modal-title">ورود به حساب</h2>
          <button type="button" className="close-btn" onClick={resetStateAndClose} aria-label="بستن">
            ×
          </button>
        </div>

        {step === 1 ? (
          <form className="section-grid" onSubmit={handleRequestOtp}>
            <div className="form-group">
              <label htmlFor="loginPhone">شماره موبایل</label>
              <input
                id="loginPhone"
                type="tel"
                inputMode="tel"
                placeholder="مثال: 09123456789"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                required
              />
            </div>
            {error && <span className="error-text">{error}</span>}
            {info && <span className="success-text">{info}</span>}
            <div className="form-actions">
              <button type="button" className="secondary-btn" onClick={resetStateAndClose}>
                انصراف
              </button>
              <button type="submit" className="btn btn-login">
                ارسال کد تایید
              </button>
            </div>
          </form>
        ) : (
          <form className="section-grid" onSubmit={handleVerifyOtp}>
            <div className="form-group">
              <label htmlFor="otpCode">کد تایید</label>
              <input
                id="otpCode"
                type="text"
                inputMode="numeric"
                placeholder="کد ۶ رقمی"
                value={otp}
                onChange={(event) => setOtp(event.target.value.replace(/[^0-9]/g, ''))}
                required
              />
            </div>
            {pendingOtp?.phone && (
              <span className="success-text">کد برای شماره {pendingOtp.phone} ارسال شده است.</span>
            )}
            {error && <span className="error-text">{error}</span>}
            {info && <span className="success-text">{info}</span>}
            <div className="form-actions">
              <button type="button" className="secondary-btn" onClick={() => setStep(1)}>
                بازگشت
              </button>
              <button type="submit" className="btn btn-login">
                تایید و ورود
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
