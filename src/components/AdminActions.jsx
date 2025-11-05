import { useNavigate } from 'react-router-dom';

export default function AdminActions() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap gap-4 justify-center mt-6 mb-10">
      {[
        { label: 'Compañías', path: '/admin/companies/create' },
        { label: 'Proveedores', path: '/admin/providers/create' },
        { label: 'Servicios', path: '/admin/services/create' },
        { label: 'Unidades', path: '/admin/units/create' },
        { label: 'Representantes', path: '/admin/representatives/create' }
      ].map(({ label, path }) => (
        <button
          key={label}
          className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded shadow transition duration-200"
          onClick={() => navigate(path)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
