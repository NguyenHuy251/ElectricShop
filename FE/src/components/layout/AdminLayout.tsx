import React from 'react';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => (
  <div style={{ display: 'flex', minHeight: '100vh', background: '#f3f4f6' }}>
    <AdminSidebar />
    <main style={{ flex: 1, padding: '24px', overflow: 'auto' }}>{children}</main>
  </div>
);

export default AdminLayout;
