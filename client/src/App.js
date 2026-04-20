import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Wrench, LayoutDashboard, Search } from 'lucide-react';
import ServiceCard from './components/ServiceCard';
import './App.css';

function App() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/services');
      setServices(res.data);
    } catch (err) { console.error("Error backend:", err); } finally { setLoading(false); }
  };

  const deleteService = async (id) => {
    if (window.confirm("¿Eliminar este servicio permanentemente?")) {
      try {
        await axios.delete(`http://localhost:3000/api/services/${id}`);
        fetchServices();
      } catch (err) { alert("Error al eliminar"); }
    }
  };

  const editService = async (service) => {
    const newName = window.prompt("Editar nombre:", service.name);
    const newPrice = window.prompt("Editar precio:", service.price);
    if (newName && newPrice) {
      try {
        await axios.put(`http://localhost:3000/api/services/${service.id}`, {
          name: newName,
          price: parseFloat(newPrice),
          description: service.description
        });
        fetchServices();
      } catch (err) { alert("Error al actualizar"); }
    }
  };

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      {/* SIDEBAR LIMPIO */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <Wrench size={24} /> <span>TechHub</span>
        </div>
        <ul className="sidebar-menu">
          <li className="menu-item active">
            <LayoutDashboard size={20}/> <span>Dashboard</span>
          </li>
        </ul>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="main-content">
        <header className="top-bar">
          <div className="search-wrapper">
            <div className="search-input-group">
              <Search className="search-icon-inside" size={22} />
              <input 
                type="text" 
                placeholder="Busca servicios por nombre (ej. Mantenimiento)..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </header>

        <div className="content-body">
          <div className="content-header">
            <h2 className="section-title">Servicios Disponibles</h2>
            <div className="stats-badge">{filteredServices.length} Servicios encontrados</div>
          </div>
          
          {loading ? (
            <div className="loader">Sincronizando base de datos...</div>
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
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;