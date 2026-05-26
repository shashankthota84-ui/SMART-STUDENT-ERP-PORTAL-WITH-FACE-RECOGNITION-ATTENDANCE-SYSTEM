/**
 * @file main.jsx
 * @description Entry point of the React application. Renders the root component (App) into the DOM.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Create the root element and render the React application inside it
createRoot(document.getElementById('root')).render(
  // StrictMode helps highlight potential problems in an application
  <StrictMode>
    <App />
  </StrictMode>,
)
