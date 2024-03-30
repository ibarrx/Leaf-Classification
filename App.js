import React from 'react';
import { AuthProvider } from './routes/AuthContext'; // Import AuthProvider from your context file
import Navigator from './routes/homeStack';

export default function App() {
  return (
    <AuthProvider>
      <Navigator />
    </AuthProvider>
  );
}
