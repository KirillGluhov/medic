import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { LoginProvider } from './context/LoginContext';
import { NameProvider } from './context/NameContext';
import { PatientAndInspectionProvider } from './context/PatientAndInspectionContext';
import { Provider } from 'react-redux';
import store from './stores/store';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <PatientAndInspectionProvider>
          <LoginProvider>
            <NameProvider>
              <App />
            </NameProvider>
          </LoginProvider>
        </PatientAndInspectionProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
