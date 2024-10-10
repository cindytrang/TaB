import logo from './logo.svg';
import './App.css';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
      return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <Router>
    <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route 
            path="/" 
            element={
                <ProtectedRoute>
                    <Home />
                </ProtectedRoute>
            } 
        />
    </Routes>
    </Router>
  );
}

export default App;
