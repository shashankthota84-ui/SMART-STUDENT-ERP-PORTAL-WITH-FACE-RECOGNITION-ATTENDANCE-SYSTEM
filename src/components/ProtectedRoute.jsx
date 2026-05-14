// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { getLoggedInUser, isFaceVerified } from '../utils/storageUtils';

const ProtectedRoute = ({ children, requireFaceVerification = true }) => {
  const user = getLoggedInUser();
  const faceVerified = isFaceVerified();

  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user is logged in but requires face verification and hasn't done it
  if (requireFaceVerification && !faceVerified) {
    return <Navigate to="/face-verification" replace />;
  }

  return children;
};

export default ProtectedRoute;
