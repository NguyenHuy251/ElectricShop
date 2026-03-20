import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface UserLayoutProps {
  children: React.ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f3f4f6' }}>
    <Header />
    <main style={{ flex: 1 }}>{children}</main>
    <Footer />
  </div>
);

export default UserLayout;
