import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Wrench, LayoutDashboard, Search, PlusCircle } from 'lucide-react';
import ServiceCard from './components/ServiceCard';
import './App.css';

// Usamos la variable de entorno de Vercel
const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  // Cargar servicios al iniciar
  useEffect(() => { 
    fetchServices(); 
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      // Petición al backend en Render
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

  const addService = async () => {
    const name = window.prompt("Nombre del nuevo servicio:");
    const description = window.prompt("Descripción:");
    const price = window.prompt("Precio (S/):");

    if (name && price) {
      try {
        await axios.post(`${API_URL}/services`, {
          name,
          description,
          price: parseFloat(price)
        });
        fetchServices();
      } catch (err) {
        alert("Error al guardar el servicio");
      }
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
    const newName = window.prompt("Editar nombre:", service.name);
    const newPrice = window.prompt("Editar precio:", service.price);
    if (newName && newPrice) {
      try {
        await axios.put(`${API_URL}/services/${service.id}`, {
          name: newName,
          price: parseFloat(newPrice),
          description: service.description
        });
        fetchServices();
      } catch (err) { 
        alert("Error al actualizar"); 
      }
    }
  };

  const filteredServices = services.filter(s => {
  // Si s.name no existe, intenta con s.nombre, y si no, usa un texto vacío
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
            <LayoutDashboard size={20}/> <span>Dashboard</span>
          </li>
          <li className="menu-item" onClick={addService} style={{cursor: 'pointer'}}>
            <PlusCircle size={20}/> <span>Nuevo Servicio</span>
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
                <div className="no-data">No se encontraron servicios en la nube.</div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;