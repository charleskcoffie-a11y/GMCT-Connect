import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { registerSW } from 'virtual:pwa-register';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register Service Worker for PWA
registerSW({
  immediate: true,
  onRegistered(swUrl) {
    console.log('Service Worker registered:', swUrl);
  },
  onNeedRefresh() {
    console.log('New content available, refreshing...');
  },
  onOfflineReady() {
    console.log('App ready to work offline');
  }
});
