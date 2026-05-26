/**
 * @file ProtectedRoute.jsx
 * @description Higher-Order Component (HOC) used to protect routes that require authentication.
 * It checks if a user is logged in and conditionally if they have passed face verification.
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { getLoggedInUser, isFaceVerified } from '../utils/storageUtils';

/**
 * ProtectedRoute Component
 * @param {Object} props - React props
 * @param {React.ReactNode} props.children - The protected component to render if checks pass
 * @param {boolean} [props.requireFaceVerification=true] - Whether this route strictly requires face verification
 * @returns {JSX.Element} The children component or a redirect
 */
const ProtectedRoute = ({ children, requireFaceVerification = true }) => {
  // Fetch current user and verification state from storage
  const user = getLoggedInUser();
  const faceVerified = isFaceVerified();

  // Redirect to the login page if there is no logged-in user
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to face verification if it's required but not yet completed
  if (requireFaceVerification && !faceVerified) {
    return <Navigate to="/face-verification" replace />;
  }

  // If all checks pass, render the protected content
  return children;
};

export default ProtectedRoute;
