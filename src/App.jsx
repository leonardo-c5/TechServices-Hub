import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

// URL de Render (Backend)
const API_URL = "https://techservices-hub-aopg.onrender.com/api";
// URL Base para mostrar las imágenes
const IMAGE_BASE_URL = "https://techservices-hub-aopg.onrender.com";

function App() {
  const [servicios, setServicios] = useState([])
  const [categorias, setCategorias] = useState([]) // NUEVO: Estado para categorías
  const [busqueda, setBusqueda] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('') // NUEVO: Estado para el filtro
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [archivo, setArchivo] = useState(null)
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoriaId: '' // NUEVO: Categoría en el formulario
  })

  // ACTUALIZADO: Ahora carga servicios y categorías al mismo tiempo
  const cargarDatos = async () => {
    try {
      setLoading(true)
      const [resServicios, resCategorias] = await Promise.all([
        axios.get(`${API_URL}/services`),
        axios.get(`${API_URL}/categorias`)
      ]);
      setServicios(resServicios.data)
      setCategorias(resCategorias.data)
      setError('')
    } catch (err) {
      console.error(err);
      setError('No se pudo conectar con la base de datos. Asegúrate de que Render esté despierto.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarDatos()
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
      setLoading(true)
      
      const formData = new FormData();
      formData.append('name', form.nombre);
      formData.append('description', form.descripcion);
      formData.append('price', form.precio);
      
      // NUEVO: Agregamos la categoría si fue seleccionada
      if (form.categoriaId) {
        formData.append('categoriaId', form.categoriaId);
      }
      
      if (archivo) {
        formData.append('image', archivo);
      }
      
      await axios.post(`${API_URL}/services`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      // ACTUALIZADO: Limpiamos también la categoría
      setForm({ nombre: '', descripcion: '', precio: '', categoriaId: '' })
      setArchivo(null) 
      cargarDatos() // ACTUALIZADO: Llama a cargarDatos en vez de cargarServicios
      setError('')
      alert("¡Servicio guardado correctamente!");
    } catch (err) {
      console.error("Respuesta del servidor:", err.response?.data);
      const mensajeError = err.response?.data?.message || 'Error al guardar. Verifica la conexión.';
      setError(mensajeError);
    } finally {
      setLoading(false)
    }
  }

  const eliminar = async (id) => {
    if(window.confirm("¿Seguro que deseas eliminar este servicio permanentemente?")) {
      try {
        await axios.delete(`${API_URL}/services/${id}`)
        cargarDatos() // ACTUALIZADO
      } catch (err) {
        setError('No se pudo eliminar el servicio')
      }
    }
  }

  // ACTUALIZADO: Lógica de filtrado combinado (Nombre + Categoría)
  const filtrados = servicios.filter((s) => {
    const nombreSeguro = s.name || s.nombre || "";
    const coincideNombre = nombreSeguro.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = filtroCategoria ? String(s.categoriaId) === String(filtroCategoria) : true;
    return coincideNombre && coincideCategoria;
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
          <h1 style={{ 
            fontSize: 'clamp(32px, 8vw, 56px)', 
            margin: '0', 
            fontWeight: '800', 
            textShadow: '0 4px 18px rgba(0,0,0,0.25)' 
          }}>
            TechServices Hub
          </h1>
          <p style={{ marginTop: '14px', fontSize: '18px', color: '#dbeafe', maxWidth: '760px', marginInline: 'auto', lineHeight: '1.7' }}>
            Plataforma de gestión de servicios tecnológicos. Administra soluciones como
            desarrollo web, soporte técnico, diseño UI/UX, ciberseguridad y más.
          </p>
        </div>

        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '28px', 
          justifyContent: 'center', 
          alignItems: 'start' 
        }}>
          
          {/* FORMULARIO */}
          <div style={{ 
            flex: '1 1 350px', 
            maxWidth: '600px',
            background: 'rgba(255,255,255,0.14)', 
            backdropFilter: 'blur(14px)', 
            border: '1px solid rgba(255,255,255,0.18)', 
            borderRadius: '24px', 
            padding: '30px', 
            boxShadow: '0 20px 40px rgba(0,0,0,0.25)' 
          }}>
            <h2 style={{ color: 'white', marginTop: 0, marginBottom: '10px', fontSize: '28px' }}>
              Registrar servicio
            </h2>
            <p style={{ color: '#dbeafe', marginTop: 0, marginBottom: '25px', lineHeight: '1.6' }}>
              Agrega un nuevo servicio al catálogo con su imagen y datos.
            </p>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', color: '#e0f2fe', marginBottom: '8px', fontWeight: '600' }}>Nombre del servicio</label>
                <input name="nombre" placeholder="Ej. Formateo PC" onChange={handleChange} value={form.nombre} required style={{ width: '100%', padding: '14px 16px', borderRadius: '14px', border: 'none', outline: 'none', fontSize: '15px' }} />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', color: '#e0f2fe', marginBottom: '8px', fontWeight: '600' }}>Descripción</label>
                <input name="descripcion" placeholder="Limpieza de virus..." onChange={handleChange} value={form.descripcion} required style={{ width: '100%', padding: '14px 16px', borderRadius: '14px', border: 'none', outline: 'none', fontSize: '15px' }} />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', color: '#e0f2fe', marginBottom: '8px', fontWeight: '600' }}>Precio (S/)</label>
                <input name="precio" type="number" placeholder="Ej. 50" onChange={handleChange} value={form.precio} required style={{ width: '100%', padding: '14px 16px', borderRadius: '14px', border: 'none', outline: 'none', fontSize: '15px' }} />
              </div>

              {/* NUEVO: SELECTOR DE CATEGORÍA */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', color: '#e0f2fe', marginBottom: '8px', fontWeight: '600' }}>Categoría</label>
                <select name="categoriaId" value={form.categoriaId} onChange={handleChange} style={{ width: '100%', padding: '14px 16px', borderRadius: '14px', border: 'none', outline: 'none', fontSize: '15px', backgroundColor: 'white' }}>
                  <option value="">-- Selecciona una categoría --</option>
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name || cat.nombre}</option>
                  ))}
                </select>
              </div>

              {/* INPUT DE IMAGEN */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', color: '#e0f2fe', marginBottom: '8px', fontWeight: '600' }}>Imagen del servicio</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setArchivo(e.target.files[0])} 
                  style={{ color: 'white', fontSize: '14px' }} 
                />
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
          <div style={{ 
            flex: '1 1 350px', 
            maxWidth: '600px',
            background: 'rgba(255,255,255,0.14)', 
            backdropFilter: 'blur(14px)', 
            border: '1px solid rgba(255,255,255,0.18)', 
            borderRadius: '24px', 
            padding: '30px', 
            boxShadow: '0 20px 40px rgba(0,0,0,0.25)' 
          }}>
            <h2 style={{ color: 'white', marginTop: 0, marginBottom: '10px', fontSize: '28px' }}>Buscar servicios</h2>
            
            {/* NUEVO: CONTROLES DE FILTRADO COMBINADOS */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '22px' }}>
              <input type="text" placeholder="Filtrar por nombre..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} style={{ flex: 2, padding: '14px 16px', borderRadius: '14px', border: 'none', outline: 'none', fontSize: '15px' }} />
              <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)} style={{ flex: 1, padding: '14px 16px', borderRadius: '14px', border: 'none', outline: 'none', fontSize: '15px', backgroundColor: 'white' }}>
                <option value="">Todas</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name || cat.nombre}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gap: '16px', maxHeight: '520px', overflowY: 'auto', paddingRight: '4px' }}>
              {loading ? (
                 <div style={{ color: 'white', textAlign: 'center' }}>Sincronizando base de datos...</div>
              ) : filtrados.length > 0 ? (
                filtrados.map((s) => (
                  // ACTUALIZADO: position: 'relative' para la etiqueta de categoría
                  <div key={s.id} style={{ background: 'rgba(255,255,255,0.96)', borderRadius: '18px', padding: '18px', textAlign: 'left', borderLeft: '6px solid #2563eb', position: 'relative' }}>
                    
                    {/* NUEVO: ETIQUETA VISUAL DE CATEGORÍA */}
                    {s.categoria && (
                      <span style={{ position: 'absolute', top: '10px', right: '10px', background: '#3b82f6', color: 'white', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', zIndex: 1, boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                        {s.categoria.name || s.categoria.nombre}
                      </span>
                    )}

                    {/* VISUALIZACIÓN DE IMAGEN */}
                    {s.image && (
                      <img 
                        src={`${IMAGE_BASE_URL}${s.image}`} 
                        alt={s.name || s.nombre} 
                        style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '12px', marginBottom: '12px' }} 
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                      {/* Le di un poco de padding derecho al título para que no choque con la etiqueta */}
                      <h3 style={{ margin: 0, color: '#1e3a8a', fontSize: '20px', paddingRight: '80px' }}>{s.name || s.nombre}</h3>
                      <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '6px 12px', borderRadius: '999px', fontSize: '13px', fontWeight: '700' }}>S/ {s.price || s.precio}</span>
                    </div>
                    <p style={{ margin: '0 0 16px 0', color: '#475569' }}>{s.description || s.descripcion}</p>
                    <button onClick={() => eliminar(s.id)} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Eliminar</button>
                  </div>
                ))
              ) : (
                <div style={{ background: 'rgba(255,255,255,0.96)', borderRadius: '18px', padding: '24px', textAlign: 'center', color: '#475569' }}>
                  No se encontraron servicios registrados.
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