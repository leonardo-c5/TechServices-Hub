import React from 'react';
import { Edit3, Trash2, Tag, DollarSign } from 'lucide-react';

const ServiceCard = ({ service, onDelete, onEdit }) => {
  return (
    <div className="service-card">
      <div className="card-body">
        <div className="card-header">
          <Tag size={18} className="icon-tag" />
          <h3>{service.name}</h3>
        </div>
        <p className="description">{service.description}</p>
        <div className="price-tag">
          <DollarSign size={16} />
          S/ {service.price}
        </div>
      </div>
      <div className="card-actions">
        <button className="btn-edit" onClick={() => onEdit(service)}>
          <Edit3 size={18} /> Editar
        </button>
        <button className="btn-delete" onClick={() => onDelete(service.id)}>
          <Trash2 size={18} /> Eliminar
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
        .icon-tag { color: #2563eb; opacity: 0.6; }
        .card-body h3 { margin: 0; color: #1e293b; font-size: 1.3rem; font-weight: 700; }
        .description { color: #64748b; font-size: 0.95rem; margin-bottom: 20px; line-height: 1.5; }
        .price-tag { 
          display: inline-flex;
          align-items: center;
          gap: 5px;
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