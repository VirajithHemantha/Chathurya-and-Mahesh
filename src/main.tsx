import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AdminPage } from './AdminPage.tsx';
import './index.css';

const path = window.location.pathname.toLowerCase();
const isAdmin = path === '/admin' || path === '/admin/';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isAdmin ? <AdminPage /> : <App />}
  </StrictMode>,
);
