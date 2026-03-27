import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authAtom } from '../../recoil/atoms/authAtom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  allowEmployee?: boolean;
  allowedEmployeeRoles?: ('staff' | 'supervisor' | 'manager')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
  allowEmployee = false,
  allowedEmployeeRoles,
}) => {
  const user = useRecoilValue(authAtom);
  const location = useLocation();

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  // Check if user is admin
  if (user.role === 'admin') return <>{children}</>;

  // Check if user is employee and allowed
  if (allowEmployee && user.isEmployee && user.employeeRole) {
    if (allowedEmployeeRoles && !allowedEmployeeRoles.includes(user.employeeRole)) {
      return <Navigate to="/" replace />;
    }
    return <>{children}</>;
  }

  // If requireAdmin and user is not admin/employee
  if (requireAdmin) return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
