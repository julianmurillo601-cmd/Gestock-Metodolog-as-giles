import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import DashboardAdmin from './pages/DashboardAdmin';
import DashboardUser from './pages/DashboardUser';
import Productos from './pages/Productos';
import Categorias from './pages/Categorias';
import Movimientos from './pages/Movimientos';
import Usuarios from './pages/Usuarios';
import ReporteStock from './pages/ReporteStock';
import ReporteMovimientos from './pages/ReporteMovimientos';
import Perfil from './pages/Perfil';
import DetalleProducto from './pages/DetalleProducto';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin" element={<PrivateRoute adminOnly={true}><DashboardAdmin /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><DashboardUser /></PrivateRoute>} />
          <Route path="/productos" element={<PrivateRoute adminOnly={true}><Productos /></PrivateRoute>} />
          <Route path="/productos/:id" element={<PrivateRoute adminOnly={true}><DetalleProducto /></PrivateRoute>} />
          <Route path="/categorias" element={<PrivateRoute adminOnly={true}><Categorias /></PrivateRoute>} />
          <Route path="/movimientos" element={<PrivateRoute adminOnly={true}><Movimientos /></PrivateRoute>} />
          <Route path="/usuarios" element={<PrivateRoute adminOnly={true}><Usuarios /></PrivateRoute>} />
          <Route path="/reporte-stock" element={<PrivateRoute adminOnly={true}><ReporteStock /></PrivateRoute>} />
          <Route path="/reporte-movimientos" element={<PrivateRoute adminOnly={true}><ReporteMovimientos /></PrivateRoute>} />
          <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
