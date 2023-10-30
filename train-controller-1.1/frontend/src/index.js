import React, {useState} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Main from './Main.js';
import Login from './Login.js';
import reportWebVitals from './reportWebVitals.js';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';


function App() {
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login setAuthenticated={setAuthenticated} />} />
        {authenticated ? (
          <Route path="*" element={<Main />} />
        ) : (
          <Route path="*" element={<Link to="/login" />} /> ///Ändrade här till Link istället för Navigate to för att göra länken relativ istället för absolut och då fungerar driftsättningen för frontend
        )}
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
