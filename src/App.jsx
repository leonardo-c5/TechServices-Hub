import { useState, useEffect } from 'react';
import axios from 'axios';
import { Wrench, LayoutDashboard, Search, PlusCircle, Save, X } from 'lucide-react';
import ServiceCard from './components/ServiceCard';
import './App.css';

// Usamos la variable de entorno de Vercel
const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  // Estados para manejar el formulario
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: ''
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/services`);
      setServices(res.data);
      setError(null);
    } catch (err) {
      console.error("Error backend:", err);
      setError("No se pudo sincronizar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/services`, {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price)
      });
      
      setFormData({ name: '', description: '', price: '' });
      setShowForm(false);
      fetchServices();
      alert("¡Servicio guardado con éxito en la nube!");
    } catch (err) {
      alert("Error al guardar el servicio");
    }
  };

  const deleteService = async (id) => {
    if (window.confirm("¿Eliminar este servicio permanentemente?")) {
      try {
        await axios.delete(`${API_URL}/services/${id}`);
        fetchServices();
      } catch (err) {
        alert("Error al eliminar");
      }
    }
  };

  const editService = async (service) => {
    const newName = window.prompt("Editar nombre:", service.name || service.nombre);
    const newPrice = window.prompt("Editar precio:", service.price || service.precio);
    if (newName && newPrice) {
      try {
        await axios.put(`${API_URL}/services/${service.id}`, {
          name: newName,
          price: parseFloat(newPrice),
          description: service.description || service.descripcion
        });
        fetchServices();
      } catch (err) {
        alert("Error al actualizar");
      }
    }
  };

  const filteredServices = services.filter(s => {
    // Escudo protector contra datos viejos
    const nombreSeguro = s.name || s.nombre || "";
    return nombreSeguro.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <Wrench size={24} /> <span>TechHub</span>
        </div>
        <ul className="sidebar-menu">
          <li className="menu-item active">
            <LayoutDashboard size={20} /> <span>Dashboard</span>
          </li>
          <li className="menu-item" onClick={() => setShowForm(!showForm)} style={{ cursor: 'pointer', background: showForm ? 'rgba(255,255,255,0.1)' : 'transparent' }}>
            <PlusCircle size={20} /> <span>{showForm ? 'Cancelar Registro' : 'Nuevo Servicio'}</span>
          </li>
        </ul>
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <div className="search-wrapper">
            <div className="search-input-group">
              <Search className="search-icon-inside" size={22} />
              <input
                type="text"
                placeholder="Busca servicios por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </header>

        <div className="content-body">
          {error && <div className="error-banner">{error}</div>}

          <div className="content-header">
            <h2 className="section-title">Servicios Disponibles</h2>
            <div className="stats-badge">{filteredServices.length} Servicios encontrados</div>
          </div>

          {showForm && (
            <div style={{
              background: 'white', padding: '24px', borderRadius: '16px', 
              marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, color: '#1e293b', fontSize: '18px' }}>Registrar Nuevo Servicio</h3>
                <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '16px', alignItems: 'end' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Nombre</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="Ej. Formateo PC" style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Descripción</label>
                  <input type="text" name="description" value={formData.description} onChange={handleInputChange} required placeholder="Limpieza de virus..." style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Precio (S/)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} required placeholder="Ej. 50" style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                </div>
                <button type="submit" style={{ height: '42px', padding: '0 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                  <Save size={18} /> Guardar
                </button>
              </form>
            </div>
          )}

          {loading ? (
            <div className="loader">Sincronizando base de datos en Aiven...</div>
          ) : (
            <div className="services-grid">
              {filteredServices.map(service => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onDelete={deleteService}
                  onEdit={editService}
                />
              ))}
              {filteredServices.length === 0 && !loading && (
                <div className="no-data" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', background: 'white', borderRadius: '16px', color: '#64748b' }}>
                  No se encontraron servicios en la base de datos. ¡Registra uno nuevo!
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;