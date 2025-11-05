import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import RegisterForm from "./components/RegisterForm";
import Configuracion from "./components/Configuracion";
import UnitForm from "./components/admin/UnitForm";
import UnitList from './components/admin/UnitList';
import CompanyForm from './components/admin/CompanyForm';
import CompanyList from './components/admin/CompanyList';
import ServiceForm from './components/admin/ServiceForm';
import ServiceList from './components/admin/ServiceList';
import ProviderForm from './components/admin/ProviderForm';
import ProviderList from './components/admin/ProviderList';
import RepresentativeForm from "./components/admin/RepresentativeForm";
import RepresentativeList from "./components/admin/RepresentativeList";

// Configuración global de Axios
axios.defaults.baseURL = `${process.env.REACT_APP_API_URL}/api`;
axios.defaults.withCredentials = true; // ✅ Importante para cookies con Sanctum

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("auth");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    window.dispatchEvent(new Event("storage"));
  }, []);

  const handleLogin = useCallback((userData, token) => {
    const authData = { user: userData, token };
    localStorage.setItem("auth", JSON.stringify(authData));
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(userData);
  }, []);

  useEffect(() => {
    const verifyAuth = async () => {
      const authData = JSON.parse(localStorage.getItem("auth"));

      if (!authData?.token) {
        setLoading(false);
        return;
      }

      try {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${authData.token}`;
        const response = await axios.get("/admin");
        setUser(response.data.user || authData.user);
      } catch (error) {
        if (error.response?.status === 401) {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [handleLogout]);

  const PrivateRoute = ({ children }) => {
    if (loading) {
      return <div>Cargando...</div>;
    }
    return user ? children : <Navigate to="/login" replace />;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta raíz "/" decide a dónde ir */}
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginForm onLogin={handleLogin} />
            )
          }
        />

        <Route path="/register" element={<RegisterForm />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard user={user} onLogout={handleLogout} />
            </PrivateRoute>
          }
        />

        <Route
          path="/configuracion"
          element={
            <PrivateRoute>
              <Configuracion user={user} onLogout={handleLogout} />
            </PrivateRoute>
          }
        />

        {/* Unidades */}
        <Route path="/admin/units" element={<UnitList />} />
        <Route path="/admin/units/create" element={<UnitForm />} />

        {/* Compañías */}
        <Route path="/admin/companies/create" element={<CompanyForm />} />
        <Route path="/admin/companies" element={<CompanyList />} />

        <Route path="/admin/services/create" element={<ServiceForm />} />
        <Route path="/admin/services" element={<ServiceList />} />

        <Route path="/admin/providers/create" element={<ProviderForm />} />
        <Route path="/admin/providers" element={<ProviderList />} />

        <Route path="/admin/representatives/create" element={<RepresentativeForm />} />
        <Route path="/admin/representatives" element={<RepresentativeList />} />

        {/* Cualquier ruta inválida redirige a "/" */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );  
}

export default App;
