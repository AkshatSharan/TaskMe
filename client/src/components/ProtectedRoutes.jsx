import React from 'react';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ isLoggedIn, children }) => {
    return isLoggedIn ? children : <Navigate to="/" />;
};

export const GuestOnlyRoute = ({ isLoggedIn, children }) => {
    return !isLoggedIn ? children : <Navigate to="/dashboard" />;
};
