import React, {useState} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Main from './Main.js';
import Login from './Login.js';
import reportWebVitals from './reportWebVitals.js';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';


function App() {
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
      <Route path="/login" element={<Login setAuthenticated={setAuthenticated} />} />
        {authenticated ? (
          <Route path="*" element={<Main />} />
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
