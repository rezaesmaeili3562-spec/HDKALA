import { useState } from 'react';
import Header from './components/Header.jsx';
import LoginForm from './components/LoginForm.jsx';
import RegisterForm from './components/RegisterForm.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import UserDashboard from './components/UserDashboard.jsx';
import { useAuth } from './context/AuthContext.jsx';

export default function App() {
  const { user } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
    <div>
      <Header onOpenLogin={() => setIsLoginOpen(true)} onOpenRegister={() => setIsRegisterOpen(true)} />
      <main className="container main-layout">
        {user?.role === 'admin' ? <AdminPanel /> : <UserDashboard user={user} />}
      </main>

      <LoginForm open={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <RegisterForm open={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
    </div>
  );
}
