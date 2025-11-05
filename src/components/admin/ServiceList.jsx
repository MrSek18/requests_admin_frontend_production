import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ServiceList() {
  const [services, setServices] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/services`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => setServices(res.data))
    .catch(() => setError('Error al cargar servicios'));
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#2e387d] pl-5 pr-5"
      style={{ fontFamily: '"Roboto SemiCondensed", sans-serif' }}
    >
      <div className="h-full w-full space-y-6 bg-white rounded-xl shadow-lg overflow-y-auto">

        {/* Botón de retroceso */}
        <div className="sticky top-0 bg-white z-10 p-1">
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
        </div>

        {/* Tabla de servicios */}
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">Listado de Servicios</h2>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className="overflow-x-auto">
            <table className="w-full text-sm border">
              <thead className="bg-blue-700 text-white">
                <tr>
                  <th className="px-4 py-2 text-left">Nombre</th>
                  <th className="px-4 py-2 text-left">Descripción</th>
                  <th className="px-4 py-2 text-left">Categoría</th>
                  <th className="px-4 py-2 text-left">Creado</th>
                </tr>
              </thead>
              <tbody>
                {services.map(service => (
                  <tr key={service.id} className="border-t">
                    <td className="px-4 py-2">{service.name}</td>
                    <td className="px-4 py-2">{service.description}</td>
                    <td className="px-4 py-2">{service.category}</td>
                    <td className="px-4 py-2">
                      {new Date(service.created_at).toLocaleDateString()}
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
