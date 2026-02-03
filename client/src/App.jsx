import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import PublicLayout from './components/PublicLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AboutUs from './pages/AboutUs';
import Specialities from './pages/Specialities';
import Packages from './pages/Packages';
import Stories from './pages/Stories';
import SendQuery from './pages/SendQuery';
import Dashboard from './pages/Dashboard';
import Doctors from './pages/Doctors';
import BookAppointment from './pages/BookAppointment';
import Appointments from './pages/Appointments';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import Patients from './pages/Patients';
import Staff from './pages/Staff';
import Admin from './pages/Admin';

function PrivateRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/specialities" element={<Specialities />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/contact" element={<SendQuery />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="book" element={<PrivateRoute allowedRoles={['patient']}><BookAppointment /></PrivateRoute>} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="reports" element={<Reports />} />
        <Route path="profile" element={<Profile />} />
        <Route path="patients" element={<PrivateRoute allowedRoles={['admin', 'staff', 'doctor']}><Patients /></PrivateRoute>} />
        <Route path="staff" element={<PrivateRoute allowedRoles={['admin', 'staff']}><Staff /></PrivateRoute>} />
        <Route path="admin" element={<PrivateRoute allowedRoles={['admin', 'staff']}><Admin /></PrivateRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
