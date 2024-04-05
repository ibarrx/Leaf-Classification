import React from 'react';
import { AuthProvider } from './routes/AuthContext';
import Navigator from './routes/homeStack'



export default function App() {
  return (
    <AuthProvider>
      <Navigator />

    </AuthProvider>
  );
}