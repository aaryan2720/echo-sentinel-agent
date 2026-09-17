/**
 * Quick route diagnostic
 * Add this temporarily to App.tsx to test
 */
import React from 'react';

// Simple test components
const TestLanding = () => <div>✅ Landing route working</div>;
const TestDashboard = () => <div>✅ Dashboard route working</div>;

// Test routes object
export const testRoutes = [
  { path: '/', element: <TestLanding /> },
  { path: '/dashboard', element: <TestDashboard /> },
];

// Add this to your browser console to test navigation:
// window.location.hash = '/dashboard'