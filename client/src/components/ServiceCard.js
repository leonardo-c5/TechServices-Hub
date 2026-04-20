import React from 'react';
import { Trash2, Edit3 } from 'lucide-react';

const ServiceCard = ({ service, onDelete }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition-shadow">
      <div>
        <h3 className="font-bold text-lg text-gray-800">{service.name}</h3>
        <p className="text-gray-500 text-sm">{service.description}</p>
        <p className="text-blue-600 font-semibold mt-1">S/ {service.price}</p>
      </div>
      <div className="flex gap-2">
        <button className="p-2 text-gray-400 hover:text-blue-500"><Edit3 size={20}/></button>
        <button 
          onClick={() => onDelete(service.id)}
          className="p-2 text-gray-400 hover:text-red-500"
        >
          <Trash2 size={20}/>
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;