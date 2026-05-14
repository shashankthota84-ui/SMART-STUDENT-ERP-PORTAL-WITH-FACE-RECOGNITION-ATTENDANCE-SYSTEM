// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import WebcamFaceBox from '../components/WebcamFaceBox';
import { saveStudent } from '../utils/storageUtils';

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    rollNumber: '',
    email: '',
    password: '',
    branch: '',
    year: '',
    phone: ''
  });
  
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!formData.fullName || !formData.rollNumber || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleFaceRegistration = async (descriptor) => {
    setError('');
    setIsProcessing(true);

    if (!descriptor) {
      setError('No face detected. Please ensure your face is clearly visible.');
      setIsProcessing(false);
      return;
    }

    try {
      // Save full student profile including face descriptor
      saveStudent({
        ...formData,
        faceDescriptor: descriptor
      });
      
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Error during registration');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="auth-container">
      <div className={`glass-panel auth-card ${step === 2 ? 'large' : ''}`}>
        <div className="text-center mb-6">
          <h1 className="page-title gradient-text">Student Registration</h1>
          <p className="page-subtitle">
            {step === 1 ? 'Step 1: Enter your details' : 'Step 2: Register your face'}
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {step === 1 ? (
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
