/**
 * Assignment 2: Text Analyzer
 * CPRO 2101 Full Stack JavaScript
 * Entry point - renders the App into the root DOM node using React 18.2.0 API.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
