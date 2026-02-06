import React, { useState } from 'react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { Login } from './components/Login';
import { AdminDashboard } from './components/AdminDashboard';
import { MemberDashboard } from './components/MemberDashboard';
import { GuestDashboard } from './components/GuestDashboard';

function AppContent() {
  const { userProfile } = useAuth();

  if (!userProfile) {
    return <Login onSuccess={() => {}} />;
  }

  // Route based on user role
  switch (userProfile.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'member':
      return <MemberDashboard />;
    case 'user':
      return <GuestDashboard />;
    default:
      return <Login onSuccess={() => {}} />;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
