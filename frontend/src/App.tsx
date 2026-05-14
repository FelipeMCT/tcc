import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashboardGestor from './pages/DashboardGestor';
import GestorMissoes from './pages/GestorMissoes';
import GestorFuncionarios from './pages/GestorFuncionarios';
import GestorFeedbacks from './pages/GestorFeedbacks';
import GestorRelatorios from './pages/GestorRelatorios';
import GestorRecompensas from './pages/GestorRecompensas';
import GestorSuporte from './pages/GestorSuporte';
import FuncionarioRecompensas from './pages/FuncionarioRecompensas';
import DashboardFuncionario from './pages/DashboardFuncionario';
import FuncionarioMissoes from './pages/FuncionarioMissoes';
import FuncionarioHistorico from './pages/FuncionarioHistorico';
import FuncionarioPerfil from './pages/FuncionarioPerfil';
import FuncionarioFeedback from './pages/FuncionarioFeedback';
import ProtectedRoute from './routes/ProtectedRoute';
import ThemeToggle from './components/ThemeToggle';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeToggle />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/gestor"
          element={
            <ProtectedRoute allowedRoles={['GESTOR']}>
              <DashboardGestor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gestor/missoes"
          element={
            <ProtectedRoute allowedRoles={['GESTOR']}>
              <GestorMissoes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gestor/funcionarios"
          element={
            <ProtectedRoute allowedRoles={['GESTOR']}>
              <GestorFuncionarios />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gestor/feedbacks"
          element={
            <ProtectedRoute allowedRoles={['GESTOR']}>
              <GestorFeedbacks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gestor/relatorios"
          element={
            <ProtectedRoute allowedRoles={['GESTOR']}>
              <GestorRelatorios />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gestor/recompensas"
          element={
            <ProtectedRoute allowedRoles={['GESTOR']}>
              <GestorRecompensas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gestor/suporte"
          element={
            <ProtectedRoute allowedRoles={['GESTOR']}>
              <GestorSuporte />
            </ProtectedRoute>
          }
        />
        <Route
          path="/funcionario"
          element={
            <ProtectedRoute allowedRoles={['FUNCIONARIO']}>
              <DashboardFuncionario />
            </ProtectedRoute>
          }
        />
        <Route
          path="/funcionario/missoes"
          element={
            <ProtectedRoute allowedRoles={['FUNCIONARIO']}>
              <FuncionarioMissoes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/funcionario/historico"
          element={
            <ProtectedRoute allowedRoles={['FUNCIONARIO']}>
              <FuncionarioHistorico />
            </ProtectedRoute>
          }
        />
        <Route
          path="/funcionario/perfil"
          element={
            <ProtectedRoute allowedRoles={['FUNCIONARIO']}>
              <FuncionarioPerfil />
            </ProtectedRoute>
          }
        />
        <Route
          path="/funcionario/feedback"
          element={
            <ProtectedRoute allowedRoles={['FUNCIONARIO']}>
              <FuncionarioFeedback />
            </ProtectedRoute>
          }
        />
        <Route
          path="/funcionario/recompensas"
          element={
            <ProtectedRoute allowedRoles={['FUNCIONARIO']}>
              <FuncionarioRecompensas />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
