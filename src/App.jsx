// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { processAbsences } from './utils/storageUtils';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import FaceVerification from './pages/FaceVerification';
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import Results from './pages/Results';
import AcademicResults from './pages/AcademicResults';
import Exams from './pages/Exams';
import Fees from './pages/Fees';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import Syllabus from './pages/Syllabus';

import './App.css';

// Layout wrapper to conditionally show navbar
const AppLayout = ({ children }) => {
  const location = useLocation();
  // Don't show navbar on these routes
  const hideNavbarRoutes = ['/login', '/register', '/face-verification', '/'];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="app-container">
      {shouldShowNavbar && <Navbar />}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

const App = () => {
  React.useEffect(() => {
    processAbsences();
  }, []);

  return (
    <Router>
      <AppLayout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Semi-Protected: Requires Login, but NOT Face Verification */}
          <Route 
            path="/face-verification" 
            element={
              <ProtectedRoute requireFaceVerification={false}>
                <FaceVerification />
              </ProtectedRoute>
            } 
          />

          {/* Fully Protected Routes: Requires Login AND Face Verification */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/attendance" 
            element={
              <ProtectedRoute>
                <Attendance />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/results" 
            element={
              <ProtectedRoute>
                <Results />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/academics" 
            element={
              <ProtectedRoute>
                <AcademicResults />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/exams" 
            element={
              <ProtectedRoute>
                <Exams />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/fees" 
            element={
              <ProtectedRoute>
                <Fees />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/syllabus" 
            element={
              <ProtectedRoute>
                <Syllabus />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AppLayout>
    </Router>
  );
};

export default App;
