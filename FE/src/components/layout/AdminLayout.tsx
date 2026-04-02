import React from 'react';
import AdminSidebar from './AdminSidebar';
import '../../assets/styles/layout/layout.css';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => (
  <div className="admin-layout">
    <AdminSidebar />
    <main className="admin-layout-main">{children}</main>
  </div>
);

export default AdminLayout;
