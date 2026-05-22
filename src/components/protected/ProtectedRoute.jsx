import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { currentUser, userRole, loading } = useAuth();

    if (loading) {
        return <div className="min-h-screen bg-[#0A192F] flex items-center justify-center text-[#64FFDA]">Loading...</div>;
    }

    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        // Redirect based on their actual role if they try to access unauthorized page
        if (userRole === 'artisan') return <Navigate to="/artisan-dashboard" />;
        if (userRole === 'admin') return <Navigate to="/admin-dashboard" />;
        return <Navigate to="/shop" />;
    }

    return children;
};

export default ProtectedRoute;
