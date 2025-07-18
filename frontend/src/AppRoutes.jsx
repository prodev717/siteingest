import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import pb from "./utils/pocketbase";
import PrivateRoute from './PrivateRoute';

function AppRoutes() {
  const location = useLocation();
  const isLoggedIn = pb.authStore.isValid;
  if (isLoggedIn && (location.pathname === "/" || location.pathname === "/login")) {
    return <Navigate to="/dashboard" replace />;
  }
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/upload" element={<PrivateRoute><Upload /></PrivateRoute>} />
    </Routes>
  );
}
export default AppRoutes;
