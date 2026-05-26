/**
 * @file FaceVerification.jsx
 * @description Page for verifying a user's face after they have successfully logged in with a password.
 * This acts as a Two-Factor Authentication (2FA) step.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WebcamFaceBox from '../components/WebcamFaceBox';
import { getLoggedInUser, setFaceVerified, isFaceVerified } from '../utils/storageUtils';
import { matchFace } from '../utils/faceUtils';

/**
 * FaceVerification Component
 * @returns {JSX.Element|null} The verification UI or null during redirects
 */
const FaceVerification = () => {
  const navigate = useNavigate();
  
  // Retrieve the user who just logged in via password
  const user = getLoggedInUser();
  
  // State for error handling and processing indicators
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Effect hook to handle routing guards.
   * Ensures only logged-in but unverified users see this page.
   */
  useEffect(() => {
    // If no user is in storage, redirect to login
    if (!user) {
      navigate('/login');
      return;
    }
    // If the user has already passed face verification, skip to dashboard
    if (isFaceVerified()) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  /**
   * Event Handler: Compares the live face descriptor with the one stored in the user's profile.
   * @param {Array|null} liveDescriptor - The face feature array from the webcam
   */
  const handleVerification = async (liveDescriptor) => {
    // Reset state before processing
    setError('');
    setIsProcessing(true);

    // Ensure face was actually captured
    if (!liveDescriptor) {
      setError('Face not clearly detected. Please try again.');
      setIsProcessing(false);
      return;
    }

    try {
      // Get the descriptor saved during registration
      const savedDescriptor = user.faceDescriptor;
      
      // Check if user has a registered face
      if (!savedDescriptor) {
         setError('No face descriptor found for this user. Please register again.');
         setIsProcessing(false);
         return;
      }

      // Perform the matching algorithm
      const { matched, distance } = matchFace(liveDescriptor, savedDescriptor);

      if (matched) {
        // Match successful: Update session and redirect
        setFaceVerified(true);
        navigate('/dashboard');
      } else {
        // Match failed: Distance is higher than the allowed threshold
        setError(`Face verification failed. Distance: ${distance.toFixed(2)} (Threshold: 0.6)`);
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during verification.');
    } finally {
      setIsProcessing(false); // Stop loading animation
    }
  };

  /**
   * Allows the user to abort verification and logout.
   */
  const handleLogout = () => {
    // Clear all session data and return to login
    localStorage.removeItem('smartERP_loggedInUser');
    localStorage.removeItem('smartERP_faceVerified');
    navigate('/login');
  };

  // Prevent rendering if useEffect hasn't redirected yet but user is missing
  if (!user) return null;

  return (
    <div className="auth-container">
      <div className="glass-panel auth-card">
        <div className="text-center mb-6">
          <h1 className="page-title gradient-text">Security Check</h1>
          <p className="page-subtitle">Verify it's you, {user.fullName.split(' ')[0]}</p>
        </div>

        <div className="mb-4 text-center">
           <p>Please look at the camera to verify your identity.</p>
        </div>

        {/* Reusable webcam component */}
        <WebcamFaceBox 
          onFaceDetected={handleVerification}
          isProcessing={isProcessing}
          buttonText="Verify Face"
          error={error}
        />

        <div className="mt-6 text-center">
           <button type="button" className="btn btn-outline text-danger" onClick={handleLogout}>
             Cancel & Logout
           </button>
        </div>
      </div>
    </div>
  );
};

export default FaceVerification;
