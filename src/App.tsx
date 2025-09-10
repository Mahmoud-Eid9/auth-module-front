import './App.css'
import UseAuth from './context/UseAuth'
import Login from './layouts/Login'
import {Routes, Route, Navigate } from 'react-router-dom';
import Register from './layouts/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './layouts/Home';

function App() {

  return (
    <div className="d-flex justify-content-center">
    <UseAuth/>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      </div>
  )
}

export default App
