/**
 * @file App.jsx
 * @description Main application component that defines the routing structure and global layout.
 * It manages protected routes, public routes, and conditionally renders the navigation bar.
 */

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

/**
 * AppLayout Component
 * @description Wrapper component that conditionally displays the Navbar based on the current route.
 * @param {Object} props - React props
 * @param {React.ReactNode} props.children - The child components to render inside the layout
 * @returns {JSX.Element} The layout structure
 */
const AppLayout = ({ children }) => {
  // Hook to get the current location/path
  const location = useLocation();
  
  // List of routes where the navigation bar should NOT be displayed
  const hideNavbarRoutes = ['/login', '/register', '/face-verification', '/'];
  
  // Boolean to determine if navbar should be shown based on current path
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="app-container">
      {/* Conditionally render the Navbar */}
      {shouldShowNavbar && <Navbar />}
      
      {/* Main content area where routed pages will be injected */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

/**
 * App Component
 * @description The root component that sets up the React Router and defines all application routes.
 * @returns {JSX.Element} The complete application router configuration
 */
const App = () => {
  // Effect hook that runs once on component mount to process any pending absences
  React.useEffect(() => {
    // Process absences from local storage or backend
    processAbsences();
  }, []);

  return (
    <Router>
      <AppLayout>
        <Routes>
          {/* Public Routes */}
          {/* Redirect root path to login by default */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Semi-Protected Route: Requires Login, but NOT Face Verification yet */}
          <Route 
            path="/face-verification" 
            element={
              <ProtectedRoute requireFaceVerification={false}>
                <FaceVerification />
              </ProtectedRoute>
            } 
          />

          {/* Fully Protected Routes: Requires Login AND successful Face Verification */}
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
          
          {/* Admin specific route */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Fallback Route: Any undefined path redirects to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AppLayout>
    </Router>
  );
};

export default App;
