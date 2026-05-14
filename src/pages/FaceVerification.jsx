// src/pages/FaceVerification.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WebcamFaceBox from '../components/WebcamFaceBox';
import { getLoggedInUser, setFaceVerified, isFaceVerified } from '../utils/storageUtils';
import { matchFace } from '../utils/faceUtils';

const FaceVerification = () => {
  const navigate = useNavigate();
  const user = getLoggedInUser();
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // If no user, send to login
    if (!user) {
      navigate('/login');
      return;
    }
    // If already verified, send to dashboard
    if (isFaceVerified()) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleVerification = async (liveDescriptor) => {
    setError('');
    setIsProcessing(true);

    if (!liveDescriptor) {
      setError('Face not clearly detected. Please try again.');
      setIsProcessing(false);
      return;
    }

    try {
      const savedDescriptor = user.faceDescriptor;
      if (!savedDescriptor) {
         setError('No face descriptor found for this user. Please register again.');
         setIsProcessing(false);
         return;
      }

      const { matched, distance } = matchFace(liveDescriptor, savedDescriptor);

      if (matched) {
        setFaceVerified(true);
        navigate('/dashboard');
      } else {
        // Distance is higher than threshold
        setError(`Face verification failed. Distance: ${distance.toFixed(2)} (Threshold: 0.6)`);
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during verification.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLogout = () => {
    // Clear session and go to login
    localStorage.removeItem('smartERP_loggedInUser');
    localStorage.removeItem('smartERP_faceVerified');
    navigate('/login');
  };

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
