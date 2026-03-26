import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import UserLayout from './components/layout/UserLayout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// User Pages
import HomePage from './pages/user/HomePage';
import ProductsPage from './pages/user/ProductsPage';
import ProductDetailPage from './pages/user/ProductDetailPage';
import CartPage from './pages/user/CartPage';
import CheckoutPage from './pages/user/CheckoutPage';
import OrdersPage from './pages/user/OrdersPage';
import ProfilePage from './pages/user/ProfilePage';
import VouchersPage from './pages/user/VouchersPage';
import NewsPage from './pages/user/NewsPage';
import NewsDetailPage from './pages/user/NewsDetailPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Admin Pages
import DashboardPage from './pages/admin/DashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminVouchersPage from './pages/admin/AdminVouchersPage';
import AdminNewsPage from './pages/admin/AdminNewsPage';
import AdminBrandsPage from './pages/admin/AdminBrandsPage';
import AdminSuppliersPage from './pages/admin/AdminSuppliersPage';
import AdminImportReceiptsPage from './pages/admin/AdminImportReceiptsPage';
import AdminReviewsPage from './pages/admin/AdminReviewsPage';

function App() {
  return (
    <Routes>
      {/* Auth Routes - No Layout */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* User Routes - UserLayout */}
      <Route
        path="/"
        element={
          <UserLayout>
            <HomePage />
          </UserLayout>
        }
      />
      <Route
        path="/products"
        element={
          <UserLayout>
            <ProductsPage />
          </UserLayout>
        }
      />
      <Route
        path="/products/:id"
        element={
          <UserLayout>
            <ProductDetailPage />
          </UserLayout>
        }
      />
      <Route
        path="/cart"
        element={
          <UserLayout>
            <CartPage />
          </UserLayout>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <UserLayout>
              <CheckoutPage />
            </UserLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <UserLayout>
              <OrdersPage />
            </UserLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <UserLayout>
              <ProfilePage />
            </UserLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/vouchers"
        element={
          <UserLayout>
            <VouchersPage />
          </UserLayout>
        }
      />
      <Route
        path="/news"
        element={
          <UserLayout>
            <NewsPage />
          </UserLayout>
        }
      />
      <Route
        path="/news/:slug"
        element={
          <UserLayout>
            <NewsDetailPage />
          </UserLayout>
        }
      />

      {/* Admin Routes - AdminLayout */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <DashboardPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminProductsPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminOrdersPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/accounts"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminUsersPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route path="/admin/users" element={<Navigate to="/admin/accounts" replace />} />
      <Route
        path="/admin/categories"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminCategoriesPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/vouchers"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminVouchersPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/news"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminNewsPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/brands"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminBrandsPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/suppliers"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminSuppliersPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/import-receipts"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminImportReceiptsPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reviews"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminReviewsPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
