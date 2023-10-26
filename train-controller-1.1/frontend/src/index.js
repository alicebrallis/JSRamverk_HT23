import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
//import App from './App';
import Main from './Main.js';
import Login from './Login.js';
import reportWebVitals from './reportWebVitals.js';
//import { Route, Routes } from 'react-router-dom';
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

// const root = ReactDOM.createRoot(document.getElementById('root'));

// root.render(
//   <BrowserRouter>
//     <React.StrictMode>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/main" element={<Main />} />
//       </Routes>
//     </React.StrictMode>
//   </BrowserRouter>
// );
// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
