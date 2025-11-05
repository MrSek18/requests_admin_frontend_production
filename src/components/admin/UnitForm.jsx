import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function UnitForm() {
  const [name, setName] = useState('');
  const [abbreviation, setAbbreviation] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/units`, {
        name,
        abbreviation
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setSuccess('✅ Se ha agregado correctamente');

      setTimeout(() => {
        navigate('/admin');
      }, 1500); // espera 1.5 segundos antes de redirigir
    } catch (err) {
      setError('Error al crear la unidad');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#2e387d]"
      style={{ fontFamily: '"Roboto SemiCondensed", sans-serif' }}
    >
      <div className="h-full w-full max-w-md space-y-6 bg-white rounded-xl shadow-lg overflow-y-auto">

        {/* Botón de retroceso */}
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
            onClick={() => navigate('/admin/units')}
            className="text-sm font-semibold text-blue-700 hover:underline mr-4"
          >
            Ver listado
          </button>
        </div>

        {/* Formulario */}
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">Crear Unidad</h2>

          <form onSubmit={handleSubmit}>
            <label className="block mb-2 font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded mb-4"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Unidad de mantenimiento"
              required
            />

            <label className="block mb-2 font-medium text-gray-700">Abreviatura</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded mb-4"
              value={abbreviation}
              onChange={(e) => setAbbreviation(e.target.value)}
              placeholder="Ej. UM"
            />

            {error && <p className="text-red-500 mb-2">{error}</p>}

            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded w-full"
            >
              Guardar
            </button>
          </form>

          {/* Mensaje de éxito */}
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
