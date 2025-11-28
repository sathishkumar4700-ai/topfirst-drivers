import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './config'; // Import config to set axios defaults
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
