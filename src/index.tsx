import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { LoginProvider } from './context/LoginContext';
import { NameProvider } from './context/NameContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <BrowserRouter>
        <LoginProvider>
          <NameProvider>
            <App />
          </NameProvider>
        </LoginProvider>
      </BrowserRouter>
  </React.StrictMode>
);
