import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [servicios, setServicios] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: ''
  })

  const cargarServicios = async () => {
  try {
    // CAMBIO: Usamos import.meta.env.VITE_API_URL
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/services`)
    setServicios(res.data)
    setError('')
  } catch (err) {
    setError('No se pudo conectar con el backend')
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
    // CAMBIO AQUÍ: Enviamos 'name' y 'description' en lugar de 'nombre' y 'descripcion'
    const datosParaEnviar = {
      name: form.nombre,
      description: form.descripcion,
      price: form.precio
    }
    
    await axios.post(`${import.meta.env.VITE_API_URL}/services`, datosParaEnviar)
    
    setForm({ nombre: '', descripcion: '', precio: '' })
    cargarServicios()
    setError('')
  } catch (err) {
    setError('Error al conectar con el servidor')
  }
}

  const eliminar = async (id) => {
  try {
    // CAMBIO: Usamos la variable de entorno
    await axios.delete(`${import.meta.env.VITE_API_URL}/services/${id}`)
    cargarServicios()
  } catch (err) {
    setError('No se pudo eliminar el servicio')
  }
}

  const filtrados = servicios.filter((s) =>
    s.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 45%, #38bdf8 100%)',
        padding: '40px 20px',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}
      >
        <div
          style={{
            textAlign: 'center',
            color: 'white',
            marginBottom: '35px'
          }}
        >
          <h1
            style={{
              fontSize: '56px',
              margin: '0',
              fontWeight: '800',
              letterSpacing: '1px',
              textShadow: '0 4px 18px rgba(0,0,0,0.25)'
            }}
          >
            TechServices Hub
          </h1>

          <p
            style={{
              marginTop: '14px',
              fontSize: '18px',
              color: '#dbeafe',
              maxWidth: '760px',
              marginInline: 'auto',
              lineHeight: '1.7'
            }}
          >
            Plataforma de gestión de servicios tecnológicos. Administra soluciones como
            desarrollo web, soporte técnico, diseño UI/UX, ciberseguridad y más.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 0.9fr',
            gap: '28px',
            alignItems: 'start'
          }}
        >
          <div
            style={{
              background: 'rgba(255,255,255,0.14)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: '24px',
              padding: '30px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)'
            }}
          >
            <h2
              style={{
                color: 'white',
                marginTop: 0,
                marginBottom: '10px',
                fontSize: '28px'
              }}
            >
              Registrar servicio
            </h2>

            <p
              style={{
                color: '#dbeafe',
                marginTop: 0,
                marginBottom: '25px',
                lineHeight: '1.6'
              }}
            >
              Agrega un nuevo servicio al catálogo de la empresa con su nombre,
              descripción y precio referencial.
            </p>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '18px' }}>
                <label
                  style={{
                    display: 'block',
                    color: '#e0f2fe',
                    marginBottom: '8px',
                    fontWeight: '600'
                  }}
                >
                  Nombre del servicio
                </label>
                <input
                  name="nombre"
                  placeholder="Ej. Desarrollo Web"
                  onChange={handleChange}
                  value={form.nombre}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '14px',
                    border: '1px solid rgba(255,255,255,0.18)',
                    outline: 'none',
                    fontSize: '15px',
                    background: 'rgba(255,255,255,0.95)',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label
                  style={{
                    display: 'block',
                    color: '#e0f2fe',
                    marginBottom: '8px',
                    fontWeight: '600'
                  }}
                >
                  Descripción
                </label>
                <input
                  name="descripcion"
                  placeholder="Ej. Creación de sitios modernos y responsivos"
                  onChange={handleChange}
                  value={form.descripcion}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '14px',
                    border: '1px solid rgba(255,255,255,0.18)',
                    outline: 'none',
                    fontSize: '15px',
                    background: 'rgba(255,255,255,0.95)',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label
                  style={{
                    display: 'block',
                    color: '#e0f2fe',
                    marginBottom: '8px',
                    fontWeight: '600'
                  }}
                >
                  Precio
                </label>
                <input
                  name="precio"
                  type="number"
                  placeholder="Ej. 1500"
                  onChange={handleChange}
                  value={form.precio}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '14px',
                    border: '1px solid rgba(255,255,255,0.18)',
                    outline: 'none',
                    fontSize: '15px',
                    background: 'rgba(255,255,255,0.95)',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '15px',
                  background: 'linear-gradient(90deg, #2563eb, #38bdf8)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '14px',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 10px 22px rgba(37,99,235,0.35)',
                  transition: '0.3s ease'
                }}
              >
                Guardar servicio
              </button>
            </form>

            {error && (
              <div
                style={{
                  marginTop: '20px',
                  background: 'rgba(239,68,68,0.15)',
                  border: '1px solid rgba(248,113,113,0.35)',
                  color: '#fee2e2',
                  padding: '14px',
                  borderRadius: '14px',
                  fontWeight: '600'
                }}
              >
                {error}
              </div>
            )}
          </div>

          <div
            style={{
              background: 'rgba(255,255,255,0.14)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: '24px',
              padding: '30px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)'
            }}
          >
            <h2
              style={{
                color: 'white',
                marginTop: 0,
                marginBottom: '10px',
                fontSize: '28px'
              }}
            >
              Buscar servicios
            </h2>

            <p
              style={{
                color: '#dbeafe',
                marginTop: 0,
                marginBottom: '20px',
                lineHeight: '1.6'
              }}
            >
              Filtra rápidamente los servicios disponibles escribiendo una palabra clave.
            </p>

            <input
              type="text"
              placeholder="Buscar servicio..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '14px',
                border: '1px solid rgba(255,255,255,0.18)',
                outline: 'none',
                fontSize: '15px',
                background: 'rgba(255,255,255,0.95)',
                boxSizing: 'border-box'
              }}
            />

            <div
              style={{
                marginTop: '22px',
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '16px',
                maxHeight: '520px',
                overflowY: 'auto',
                paddingRight: '4px'
              }}
            >
              {filtrados.length > 0 ? (
                filtrados.map((s) => (
                  <div
                    key={s.id}
                    style={{
                      background: 'rgba(255,255,255,0.96)',
                      borderRadius: '18px',
                      padding: '18px',
                      boxShadow: '0 10px 24px rgba(15,23,42,0.12)',
                      textAlign: 'left',
                      borderLeft: '6px solid #2563eb'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start',
                        gap: '12px',
                        marginBottom: '10px'
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          color: '#1e3a8a',
                          fontSize: '20px'
                        }}
                      >
                        {s.nombre}
                      </h3>

                      <span
                        style={{
                          background: '#dbeafe',
                          color: '#1d4ed8',
                          padding: '6px 12px',
                          borderRadius: '999px',
                          fontSize: '13px',
                          fontWeight: '700',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        S/ {s.precio}
                      </span>
                    </div>

                    <p
                      style={{
                        margin: '0 0 16px 0',
                        color: '#475569',
                        lineHeight: '1.6'
                      }}
                    >
                      {s.descripcion}
                    </p>

                    <button
                      onClick={() => eliminar(s.id)}
                      style={{
                        background: 'linear-gradient(90deg, #dc2626, #f97316)',
                        color: 'white',
                        border: 'none',
                        padding: '11px 16px',
                        borderRadius: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        boxShadow: '0 8px 18px rgba(220,38,38,0.25)'
                      }}
                    >
                      Eliminar servicio
                    </button>
                  </div>
                ))
              ) : (
                <div
                  style={{
                    background: 'rgba(255,255,255,0.96)',
                    borderRadius: '18px',
                    padding: '24px',
                    textAlign: 'center',
                    color: '#475569',
                    boxShadow: '0 10px 24px rgba(15,23,42,0.12)'
                  }}
                >
                  No hay servicios disponibles por el momento.
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: '30px',
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.16)',
            borderRadius: '22px',
            padding: '20px',
            color: '#e0f2fe',
            textAlign: 'center',
            boxShadow: '0 14px 28px rgba(0,0,0,0.18)'
          }}
        >
          <strong style={{ fontSize: '18px' }}>Servicios sugeridos:</strong>
          <p style={{ marginBottom: 0, marginTop: '10px', lineHeight: '1.8' }}>
            Desarrollo Web, Soporte Técnico, Diseño UI/UX, Ciberseguridad,
            Mantenimiento de Equipos, Hosting Web y Consultoría Tecnológica.
          </p>
        </div>
      </div>
    </div>
  )
}

export default App