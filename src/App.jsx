import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

// URL DIRECTA: Si Vercel falla, usa directamente tu Render
// (Asegúrate de que esta sea tu URL real de Render)
const URL_BACKEND = "https://techservices-hub-aopg.onrender.com/api"; 
const API_URL = import.meta.env.VITE_API_URL || URL_BACKEND;

function App() {
  const [servicios, setServicios] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: ''
  })

  const cargarServicios = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_URL}/services`)
      setServicios(res.data)
      setError('')
    } catch (err) {
      console.error(err);
      setError('Asegúrate de que tu backend en Render esté encendido.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarServicios()
  }, [])

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Traducimos al inglés para que la base de datos lo acepte
      const datosParaEnviar = {
        name: form.nombre,
        description: form.descripcion,
        price: form.precio
      }
      
      await axios.post(`${API_URL}/services`, datosParaEnviar)
      
      setForm({ nombre: '', descripcion: '', precio: '' })
      cargarServicios()
      setError('')
      alert("¡Servicio guardado correctamente!");
    } catch (err) {
      setError('Error al guardar. Verifica la conexión.')
    }
  }

  const eliminar = async (id) => {
    if(window.confirm("¿Seguro que deseas eliminar este servicio?")) {
      try {
        await axios.delete(`${API_URL}/services/${id}`)
        cargarServicios()
      } catch (err) {
        setError('No se pudo eliminar el servicio')
      }
    }
  }

  const filtrados = servicios.filter((s) => {
    const nombreSeguro = s.name || s.nombre || "";
    return nombreSeguro.toLowerCase().includes(busqueda.toLowerCase())
  })

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 45%, #38bdf8 100%)',
        padding: '40px 20px',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', color: 'white', marginBottom: '35px' }}>
          <h1 style={{ fontSize: '56px', margin: '0', fontWeight: '800', textShadow: '0 4px 18px rgba(0,0,0,0.25)' }}>
            TechServices Hub
          </h1>
          <p style={{ marginTop: '14px', fontSize: '18px', color: '#dbeafe', maxWidth: '760px', marginInline: 'auto', lineHeight: '1.7' }}>
            Plataforma de gestión de servicios tecnológicos. Administra soluciones como
            desarrollo web, soporte técnico, diseño UI/UX, ciberseguridad y más.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '28px', alignItems: 'start' }}>
          {/* FORMULARIO */}
          <div style={{ background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '24px', padding: '30px', boxShadow: '0 20px 40px rgba(0,0,0,0.25)' }}>
            <h2 style={{ color: 'white', marginTop: 0, marginBottom: '10px', fontSize: '28px' }}>
              Registrar servicio
            </h2>
            <p style={{ color: '#dbeafe', marginTop: 0, marginBottom: '25px', lineHeight: '1.6' }}>
              Agrega un nuevo servicio al catálogo de la empresa con su nombre, descripción y precio referencial.
            </p>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', color: '#e0f2fe', marginBottom: '8px', fontWeight: '600' }}>Nombre del servicio</label>
                <input name="nombre" placeholder="Ej. Desarrollo Web" onChange={handleChange} value={form.nombre} required style={{ width: '100%', padding: '14px 16px', borderRadius: '14px', border: 'none', outline: 'none', fontSize: '15px' }} />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', color: '#e0f2fe', marginBottom: '8px', fontWeight: '600' }}>Descripción</label>
                <input name="descripcion" placeholder="Ej. Creación de sitios modernos" onChange={handleChange} value={form.descripcion} required style={{ width: '100%', padding: '14px 16px', borderRadius: '14px', border: 'none', outline: 'none', fontSize: '15px' }} />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', color: '#e0f2fe', marginBottom: '8px', fontWeight: '600' }}>Precio</label>
                <input name="precio" type="number" placeholder="Ej. 1500" onChange={handleChange} value={form.precio} required style={{ width: '100%', padding: '14px 16px', borderRadius: '14px', border: 'none', outline: 'none', fontSize: '15px' }} />
              </div>

              <button type="submit" style={{ width: '100%', padding: '15px', background: 'linear-gradient(90deg, #2563eb, #38bdf8)', color: 'white', border: 'none', borderRadius: '14px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 10px 22px rgba(37,99,235,0.35)' }}>
                {loading ? "Sincronizando..." : "Guardar servicio"}
              </button>
            </form>

            {error && (
              <div style={{ marginTop: '20px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(248,113,113,0.35)', color: '#fee2e2', padding: '14px', borderRadius: '14px', fontWeight: '600' }}>
                {error}
              </div>
            )}
          </div>

          {/* LISTA DE SERVICIOS */}
          <div style={{ background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '24px', padding: '30px', boxShadow: '0 20px 40px rgba(0,0,0,0.25)' }}>
            <h2 style={{ color: 'white', marginTop: 0, marginBottom: '10px', fontSize: '28px' }}>Buscar servicios</h2>
            <input type="text" placeholder="Buscar servicio..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} style={{ width: '100%', padding: '14px 16px', borderRadius: '14px', border: 'none', outline: 'none', fontSize: '15px', marginBottom: '22px' }} />

            <div style={{ display: 'grid', gap: '16px', maxHeight: '520px', overflowY: 'auto', paddingRight: '4px' }}>
              {loading ? (
                 <div style={{ color: 'white', textAlign: 'center' }}>Conectando con la base de datos...</div>
              ) : filtrados.length > 0 ? (
                filtrados.map((s) => (
                  <div key={s.id} style={{ background: 'rgba(255,255,255,0.96)', borderRadius: '18px', padding: '18px', textAlign: 'left', borderLeft: '6px solid #2563eb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                      <h3 style={{ margin: 0, color: '#1e3a8a', fontSize: '20px' }}>{s.name || s.nombre}</h3>
                      <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '6px 12px', borderRadius: '999px', fontSize: '13px', fontWeight: '700' }}>S/ {s.price || s.precio}</span>
                    </div>
                    <p style={{ margin: '0 0 16px 0', color: '#475569' }}>{s.description || s.descripcion}</p>
                    <button onClick={() => eliminar(s.id)} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Eliminar</button>
                  </div>
                ))
              ) : (
                <div style={{ background: 'rgba(255,255,255,0.96)', borderRadius: '18px', padding: '24px', textAlign: 'center', color: '#475569' }}>
                  No hay servicios disponibles por el momento.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App