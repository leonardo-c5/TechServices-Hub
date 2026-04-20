import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    // Llamada a tu backend en el puerto 3000
    axios.get('http://localhost:3000/api/services')
      .then(res => setServices(res.data))
      .catch(err => console.error("Error conectando al backend", err));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Servicios Disponibles</h1>
      <ul>
        {services.map(s => (
          <li key={s.id}>{s.name} - S/ {s.price}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;