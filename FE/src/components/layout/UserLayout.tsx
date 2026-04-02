import React from 'react';
import Header from './Header';
import Footer from './Footer';
import '../../assets/styles/layout/layout.css';

interface UserLayoutProps {
  children: React.ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  return (
    <div className="user-layout">
      <Header />
      <main className="user-layout-main">{children}</main>
      <Footer />
    </div>
  );
};

export default UserLayout;
