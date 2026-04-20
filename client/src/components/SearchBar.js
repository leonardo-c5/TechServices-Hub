import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative mb-6">
      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
        <Search size={20} />
      </span>
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        placeholder="Buscar servicio por nombre..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;