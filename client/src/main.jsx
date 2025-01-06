import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { BasketProvider } from './contexts/BasketContext';
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <AuthProvider>
     <BasketProvider>
        <App />
    </BasketProvider>
  </AuthProvider>
);
