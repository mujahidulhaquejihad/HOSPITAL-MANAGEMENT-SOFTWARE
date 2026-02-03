import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Doctors from './pages/Doctors';
import BookAppointment from './pages/BookAppointment';
import Appointments from './pages/Appointments';
import Patients from './pages/Patients';
import Staff from './pages/Staff';
import Admin from './pages/Admin';

function PrivateRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
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
        <Route path="patients" element={<PrivateRoute allowedRoles={['admin', 'staff', 'doctor']}><Patients /></PrivateRoute>} />
        <Route path="staff" element={<PrivateRoute allowedRoles={['admin']}><Staff /></PrivateRoute>} />
        <Route path="admin" element={<PrivateRoute allowedRoles={['admin']}><Admin /></PrivateRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
