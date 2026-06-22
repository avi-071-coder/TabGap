import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import '../index.css';
import DashboardApp from './DashboardApp';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <DashboardApp />
    </HashRouter>

  </React.StrictMode>
);
