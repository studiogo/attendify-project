import React from 'react';
import ReactDOM from 'react-dom/client';
// Usunięto import ChakraProvider
// Usunięto import 'antd/dist/reset.css';
import 'antd/dist/reset.css'; // Import stylów Ant Design
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Usunięto ChakraProvider */}
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
