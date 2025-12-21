import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { warmUpDatabase } from "../../utils/warmUp";

export default function RepresentativeList() {
  const [representatives, setRepresentatives] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {

    const fetchRepresentatives = async () => {
      try {
        await warmUpDatabase();
        const authData = JSON.parse(localStorage.getItem("auth"));
        const token = authData?.token;

        const res = await api.get("/representatives", {
          headers: { Authorization: `Bearer ${token}`}
        });
        
        setRepresentatives(res.data);
      } catch (err) {
        console.error("Error al cargar representantes: ", err);
        setError("Error al cargar representantes");
      }
    };

    fetchRepresentatives();

  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#2e387d] pl-5 pr-5"
      style={{ fontFamily: '"Roboto SemiCondensed", sans-serif' }}
    >
      <div className="h-full w-full space-y-6 bg-white rounded-xl shadow-lg overflow-y-auto">

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
            onClick={() => navigate('/admin/representatives/create')}
            className="text-sm font-semibold text-blue-700 hover:underline mr-4"
          >
            Crear nuevo
          </button>
        </div>

        {/* Tabla de representantes */}
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">Listado de Representantes</h2>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className="overflow-x-auto">
            <table className="w-full text-sm border">
              <thead className="bg-blue-700 text-white">
                <tr>
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Nombre</th>
                  <th className="px-4 py-2 text-left">DNI</th>
                  <th className="px-4 py-2 text-left">Teléfono</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Rol</th>
                  <th className="px-4 py-2 text-left">Creado</th>
                </tr>
              </thead>
              <tbody>
                {representatives.map(rep => (
                  <tr key={rep.id} className="border-t">
                    <td className="px-4 py-2">{rep.id}</td>
                    <td className="px-4 py-2">{rep.name}</td>
                    <td className="px-4 py-2">{rep.dni}</td>
                    <td className="px-4 py-2">{rep.phone}</td>
                    <td className="px-4 py-2">{rep.email}</td>
                    <td className="px-4 py-2">{rep.role}</td>
                    <td className="px-4 py-2">
                      {new Date(rep.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
