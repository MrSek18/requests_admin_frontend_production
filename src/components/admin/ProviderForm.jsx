import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; 
import { warmUpDatabase } from "./utils/warmUp";


export default function ProviderForm() {
  const [name, setName] = useState('');
  const [ruc, setRuc] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {

      await warmUpDatabase();
      const authData = JSON.parse(localStorage.getItem("auth"));
      const token = authData?.token;


      await api.post("/providers", {
        name,
        ruc,
        address,
        phone,
        email
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setSuccess('Se ha agregado correctamente');

      setTimeout(() => {
        navigate('/admin/providers');
      }, 1500);
    } catch (err) {
      console.error("Error al crear proveedor: ", err);
      setError('Error al crear el proveedor');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#2e387d]"
      style={{ fontFamily: '"Roboto SemiCondensed", sans-serif' }}
    >
      <div className="h-full w-full max-w-md space-y-6 bg-white rounded-xl shadow-lg overflow-y-auto">

        {/* Botón de retroceso y listado */}
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
            onClick={() => navigate('/admin/providers')}
            className="text-sm font-semibold text-blue-700 hover:underline mr-4"
          >
            Ver listado
          </button>
        </div>

        {/* Formulario */}
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">Crear Proveedor</h2>

          <form onSubmit={handleSubmit}>
            <label className="block mb-2 font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded mb-4"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Servicios Industriales SAC"
              required
            />

            <label className="block mb-2 font-medium text-gray-700">RUC</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded mb-4"
              value={ruc}
              onChange={(e) => setRuc(e.target.value)}
              placeholder="Ej. 20481234567"
              required
            />

            <label className="block mb-2 font-medium text-gray-700">Dirección</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded mb-4"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ej. Av. Principal 456"
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
              placeholder="Ej. contacto@proveedor.com"
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
