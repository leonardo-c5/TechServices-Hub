import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Wrench, Loader2 } from 'lucide-react';
import SearchBar from './components/SearchBar';
import ServiceCard from './components/ServiceCard';

function App() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/services');
      setServices(res.data);
    } catch (err) {
      console.error("Error al conectar con el backend", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este servicio?")) {
      try {
        await axios.delete(`http://localhost:3000/api/services/${id}`);
        fetchServices(); // Recargar la lista (notarás que el Soft Delete funciona)
      } catch (err) {
        alert("Error al eliminar");
      }
    }
  };

  // Mejora: Filtro dinámico
  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.description && s.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container">
      <header>
        <h1><Wrench /> TechServices Hub</h1>
      </header>
      
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {loading ? (
        <div className="loader">
          <Loader2 className="spinner" size={40} />
          <p>Cargando servicios...</p>
        </div>
      ) : (
        <div className="services-grid">
          {filteredServices.map(service => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              onDelete={deleteService} 
            />
          ))}
          {filteredServices.length === 0 && <p className="empty">No hay resultados.</p>}
        </div>
      )}

      {/* Estilos mínimos para que no se vea desordenado mientras decides si usas Tailwind o CSS normal */}
      <style>{`
        .container { padding: 40px; max-width: 800px; margin: 0 auto; font-family: sans-serif; }
        header h1 { display: flex; align-items: center; gap: 10px; color: #1e40af; margin-bottom: 30px; }
        .loader { text-align: center; margin-top: 50px; color: #64748b; }
        .spinner { animation: spin 1s linear infinite; margin-bottom: 10px; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .services-grid { display: grid; gap: 15px; }
      `}</style>
    </div>
  );
}

export default App;