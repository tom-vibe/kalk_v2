/**
 * @file main.tsx
 * @description Punkt wejścia aplikacji React.
 * Odpowiada za renderowanie głównego komponentu App wewnątrz StrictMode.
 */

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Inicjalizacja głównego drzewa React
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
