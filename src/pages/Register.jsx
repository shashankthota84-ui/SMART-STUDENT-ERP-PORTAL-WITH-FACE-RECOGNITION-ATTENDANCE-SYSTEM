/**
 * @file Register.jsx
 * @description Student registration page. Includes a two-step process:
 * 1. Collect personal and academic details.
 * 2. Capture a facial descriptor for biometric authentication.
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import WebcamFaceBox from '../components/WebcamFaceBox';
import { saveStudent } from '../utils/storageUtils';

/**
 * Register Component
 * @returns {JSX.Element} The multi-step registration form
 */
const Register = () => {
  const navigate = useNavigate();
  
  // Tracks which step of registration the user is on (1: Details, 2: Face)
  const [step, setStep] = useState(1);
  
  // Form state for student details
  const [formData, setFormData] = useState({
    fullName: '',
    rollNumber: '',
    email: '',
    password: '',
    branch: '',
    year: '',
    phone: ''
  });
  
  // Error handling and loading state
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Updates form data state based on user input.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Validates details and advances to step 2 (Face Registration).
   * @param {React.FormEvent} e - Form submission event
   */
  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation for required fields
    if (!formData.fullName || !formData.rollNumber || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    
    // Clear errors and proceed to the next step
    setError('');
    setStep(2);
  };

  /**
   * Processes the captured face descriptor and finalizes registration.
   * @param {Array|null} descriptor - Facial feature array from webcam
   */
  const handleFaceRegistration = async (descriptor) => {
    setError('');
    setIsProcessing(true);

    // Validate face capture
    if (!descriptor) {
      setError('No face detected. Please ensure your face is clearly visible.');
      setIsProcessing(false);
      return;
    }

    try {
      // Save full student profile (details + biometrics) to local storage
      saveStudent({
        ...formData,
        faceDescriptor: descriptor
      });
      
      alert('Registration successful! Please login.');
      // Redirect to login page after successful registration
      navigate('/login');
    } catch (err) {
      // Handle storage errors (e.g., duplicate email/roll number)
      setError(err.message || 'Error during registration');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Dynamic class to adjust card width based on the current step */}
      <div className={`glass-panel auth-card ${step === 2 ? 'large' : ''}`}>
        <div className="text-center mb-6">
          <h1 className="page-title gradient-text">Student Registration</h1>
          <p className="page-subtitle">
            {step === 1 ? 'Step 1: Enter your details' : 'Step 2: Register your face'}
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {step === 1 ? (
          // --- STEP 1: Details Form ---
          <form onSubmit={handleDetailsSubmit}>
            <div className="auth-grid">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input 
                  type="text" 
                  name="fullName" 
                  className="form-input" 
                  value={formData.fullName} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Roll Number *</label>
                <input 
                  type="text" 
                  name="rollNumber" 
                  className="form-input" 
                  value={formData.rollNumber} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input 
                  type="email" 
                  name="email" 
                  className="form-input" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password *</label>
                <input 
                  type="password" 
                  name="password" 
                  className="form-input" 
                  value={formData.password} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Class / Branch</label>
                <input 
                  type="text" 
                  name="branch" 
                  className="form-input" 
                  value={formData.branch} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Year</label>
                <input 
                  type="text" 
                  name="year" 
                  className="form-input" 
                  value={formData.year} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone" 
                  className="form-input" 
                  value={formData.phone} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>

            <div className="mt-6 text-center">
              <button type="submit" className="btn btn-primary w-full">Next: Register Face</button>
            </div>
            
            <div className="mt-4 text-center text-muted">
              Already have an account? <Link to="/login" className="gradient-text" style={{textDecoration: 'none'}}>Login here</Link>
            </div>
          </form>
        ) : (
          // --- STEP 2: Face Registration ---
          <div>
            <div className="mb-4 text-center">
              <p>Please position your face clearly in the camera frame.</p>
              <p className="text-muted text-sm mt-1">Ensure good lighting and remove glasses/hats for best results.</p>
            </div>

            <WebcamFaceBox 
              onFaceDetected={handleFaceRegistration}
              isProcessing={isProcessing}
              buttonText="Capture & Register"
              error={error}
            />

            <div className="mt-6 text-center">
              {/* Option to go back and edit details */}
              <button 
                type="button" 
                className="btn btn-outline" 
                onClick={() => setStep(1)}
                disabled={isProcessing}
              >
                Back to Details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
