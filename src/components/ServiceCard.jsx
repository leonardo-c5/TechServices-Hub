import React from 'react';

const ServiceCard = ({ service, onDelete, onEdit }) => {
  return (
    <div className="service-card">
      <div className="card-body">
        <div className="card-header">
          <span className="icon-tag" style={{ fontSize: '18px' }}>🏷️</span>
          {/* Escudo protector: acepta name en inglés o nombre en español */}
          <h3>{service.name || service.nombre}</h3>
        </div>
        <p className="description">{service.description || service.descripcion}</p>
        <div className="price-tag">
          <span style={{ fontSize: '18px' }}>💰</span>
          S/ {service.price || service.precio}
        </div>
      </div>
      <div className="card-actions">
        <button className="btn-edit" onClick={() => onEdit(service)}>
          ✏️ Editar
        </button>
        <button className="btn-delete" onClick={() => onDelete(service.id)}>
          🗑️ Eliminar
        </button>
      </div>

      <style>{`
        .service-card {
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
          border: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .service-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
        }
        .card-body { padding: 25px; flex-grow: 1; }
        .card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
        .icon-tag { opacity: 0.8; }
        .card-body h3 { margin: 0; color: #1e293b; font-size: 1.3rem; font-weight: 700; }
        .description { color: #64748b; font-size: 0.95rem; margin-bottom: 20px; line-height: 1.5; }
        .price-tag { 
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-weight: bold; 
          color: #2563eb; 
          font-size: 1.25rem; 
          background: #eff6ff;
          padding: 6px 15px;
          border-radius: 50px;
        }
        .card-actions { 
          display: flex; 
          border-top: 1px solid #f1f5f9;
          background: #f8fafc;
        }
        .card-actions button {
          flex: 1;
          padding: 15px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-weight: 600;
          transition: background 0.2s;
          font-size: 0.9rem;
        }
        .btn-edit { background: transparent; color: #1e293b; }
        .btn-edit:hover { background: #eff6ff; color: #2563eb; }
        .btn-delete { background: transparent; color: #ef4444; border-left: 1px solid #f1f5f9 !important; }
        .btn-delete:hover { background: #fef2f2; }
      `}</style>
    </div>
  );
};

export default ServiceCard;