// src/components/admin/RepresentativeForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { warmUpDatabase } from "../../utils/warmUp";

export default function RepresentativeForm() {
  const [name, setName] = useState('');
  const [dni, setDni] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [position, setPosition] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {

    const fetchCompanies = async () => {
      try {
        await warmUpDatabase();
        const authData = JSON.parse(localStore.getItem("auth"));
        const token = authData?.token;

        const res = await api.get("/companies", {
          headers: { Authorizacion: `Bearer ${token}`}
        });

        setCompanies(res.data);
      } catch (err) {
        console.error("Error al cargar compañías: ", err);
        setError("Error al cargar compañías");
      }
    };

    fetchCompanies();

  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {

      await warmUpDatabase();
      const authData = JSON.parse(localStorage.getItem("auth"));
      const token = authData?.token;

      const repRes = await api.post("/representatives", {
        name, dni, phone, email, role
      }, {
        headers: { Authorization: `Bearer ${token}`}
      })

      const representativeId = repRes.data.representative.id;

      await api.post("/company-representatives", {
        company_id: companyId,
        representative_id: representativeId,
        position
      }, {
        headers: {Authorization: `Bearer ${token}`}
      })

      setSuccess(' Representante registrado correctamente');

      setTimeout(() => {
        navigate('/admin/representatives');
      }, 1500);
    } catch (err) {
      console.error('Error al registrar representante:', err);
      setError("Error al registrar representante");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#2e387d]"
      style={{ fontFamily: '"Roboto SemiCondensed", sans-serif' }}
    >
      <div className="h-full w-full max-w-md space-y-6 bg-white rounded-xl shadow-lg overflow-y-auto">

        {/* Botones de navegación */}
        <div className="sticky top-0 bg-white z-10 p-1 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="group flex p-3 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg
              className="w-8 h-8 text-black group-hover:text-gray-700"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>

          <button
            onClick={() => navigate('/admin/representatives')}
            className="text-sm font-semibold text-blue-700 hover:underline mr-4"
          >
            Ver listado
          </button>
        </div>

        {/* Formulario */}
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">Registrar Representante</h2>

          <form onSubmit={handleSubmit}>
            <label className="block mb-2 font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded mb-4"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Juan Pérez"
              required
            />

            <label className="block mb-2 font-medium text-gray-700">DNI</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded mb-4"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              placeholder="Ej. 12345678"
              required
            />

            <label className="block mb-2 font-medium text-gray-700">Teléfono</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded mb-4"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ej. 987654321"
            />

            <label className="block mb-2 font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="w-full border px-3 py-2 rounded mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ej. juan@example.com"
            />

            <label className="block mb-2 font-medium text-gray-700">Rol</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded mb-4"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Ej. Supervisor"
            />

            <label className="block mb-2 font-medium text-gray-700">Compañía</label>
            <select
              className="w-full border px-3 py-2 rounded mb-4"
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              required
            >
              <option value="">Selecciona una compañía</option>
              {companies.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <label className="block mb-2 font-medium text-gray-700">Cargo en la compañía</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded mb-4"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="Ej. Coordinador"
              required
            />

            {error && <p className="text-red-500 mb-2">{error}</p>}

            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded w-full"
            >
              Guardar
            </button>
          </form>

          {success && (
            <div className="mt-4 text-green-600 text-center font-medium">
              {success}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
