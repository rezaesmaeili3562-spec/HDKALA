import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext();

const ADMIN_PHONE = '09120000000';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [pendingOtp, setPendingOtp] = useState(null);

  const requestOtp = (phone) => {
    const sanitizedPhone = phone.replace(/[^0-9]/g, '');
    if (sanitizedPhone.length !== 11 || !sanitizedPhone.startsWith('09')) {
      throw new Error('لطفا شماره موبایل معتبر وارد کنید.');
    }

    const generatedCode = String(Math.floor(100000 + Math.random() * 900000));
    const role = sanitizedPhone === ADMIN_PHONE ? 'admin' : 'user';
    const name = role === 'admin' ? 'مدیر ارشد سیستم' : 'کاربر فروشگاه';

    setPendingOtp({ phone: sanitizedPhone, code: generatedCode, role, name });
    return generatedCode;
  };

  const verifyOtp = (code) => {
    if (!pendingOtp) {
      throw new Error('کدی برای تایید وجود ندارد. لطفا مجدد درخواست دهید.');
    }

    if (pendingOtp.code !== code) {
      throw new Error('کد تایید وارد شده صحیح نیست.');
    }

    const nextUser = {
      role: pendingOtp.role,
      name: pendingOtp.name,
      phone: pendingOtp.phone,
      email: pendingOtp.role === 'admin' ? 'admin@hdkala.com' : null,
      avatar: pendingOtp.role === 'admin' ? 'https://i.pravatar.cc/150?img=12' : 'https://i.pravatar.cc/150?img=56'
    };

    setUser(nextUser);
    setPendingOtp(null);
    return nextUser;
  };

  const registerUser = ({ name, phone, email }) => {
    const sanitizedPhone = phone.replace(/[^0-9]/g, '');
    if (sanitizedPhone.length !== 11 || !sanitizedPhone.startsWith('09')) {
      throw new Error('شماره موبایل وارد شده صحیح نیست.');
    }

    const nextUser = {
      role: 'user',
      name,
      phone: sanitizedPhone,
      email,
      avatar: 'https://i.pravatar.cc/150?img=47'
    };

    setUser(nextUser);
    return nextUser;
  };

  const logout = () => {
    setUser(null);
    setPendingOtp(null);
  };

  const value = useMemo(
    () => ({
      user,
      pendingOtp,
      requestOtp,
      verifyOtp,
      registerUser,
      logout
    }),
    [user, pendingOtp]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth باید داخل AuthProvider استفاده شود.');
  }
  return context;
}
