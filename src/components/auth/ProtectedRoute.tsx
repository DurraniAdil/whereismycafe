import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: React.ReactNode;
    fallback?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
    children, 
    fallback = '/' 
}) => {
    const { isAuthenticated, loading } = useAuth();

    // Still checking auth state? Show nothing or a small spinner if you like
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8F6F1]">
                <div className="w-8 h-8 border-4 border-[#0b4e9d]/20 border-t-[#0b4e9d] rounded-full animate-spin" />
            </div>
        );
    }

    // Not authenticated -> redirect to fallback
    if (!isAuthenticated) {
        return <Navigate to={fallback} replace />;
    }

    return <>{children}</>;
};
