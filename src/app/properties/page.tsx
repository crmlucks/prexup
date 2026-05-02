"use client";

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  BedDouble, 
  Bath, 
  Square,
  Home,
  Tag,
  ChevronRight,
  Heart
} from 'lucide-react';
import { motion } from 'framer-motion';
import { PropertyModal } from '@/components/properties/PropertyModal';

const properties = [
  { id: '1', title: 'Villa Moderna frente al Mar', price: '$2.5M', location: 'Malibu, CA', type: 'Casa', beds: 5, baths: 4, area: '4,500 m²', status: 'Disponible', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800' },
  { id: '2', title: 'Penthouse en el Centro', price: '$1.2M', location: 'Miami, FL', type: 'Apartamento', beds: 3, baths: 2, area: '2,200 m²', status: 'Reservado', image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=800' },
  { id: '3', title: 'Mansión de Lujo', price: '$4.8M', location: 'Beverly Hills, CA', type: 'Casa', beds: 7, baths: 6, area: '8,200 m²', status: 'Disponible', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800' },
  { id: '4', title: 'Loft Moderno Acogedor', price: '$850k', location: 'Brooklyn, NY', type: 'Apartamento', beds: 2, baths: 1, area: '1,500 m²', status: 'Vendido', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800' },
  { id: '5', title: 'Casa Familiar Suburbana', price: '$600k', location: 'Austin, TX', type: 'Casa', beds: 4, baths: 3, area: '3,000 m²', status: 'Disponible', image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80&w=800' },
  { id: '6', title: 'Espacio de Oficina Comercial', price: '$3.5M', location: 'Chicago, IL', type: 'Comercial', beds: 0, baths: 4, area: '12,000 m²', status: 'Disponible', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800' },
];

export default function PropertiesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  const handleOpenModal = (prop?: any) => {
    setSelectedProperty(prop);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4 animate-fade-in pb-10">
      <PropertyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        property={selectedProperty} 
      />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-outfit tracking-tight">Inventario de Propiedades</h1>
          <p className="text-muted text-xs mt-0.5">Gestiona y rastrea tu catálogo inmobiliario.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative group">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-brand-purple transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar por nombre o lugar..." 
              className="pl-9 pr-3 py-1.5 rounded-lg text-[11px] focus:outline-none focus:border-brand-purple/50 transition-all w-48 md:w-64"
            />
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-brand text-white text-[11px] font-bold shadow-lg shadow-brand-purple/20 transition-all hover:scale-[1.02]"
          >
            <Plus size={14} />
            Nueva Propiedad
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap gap-2 items-center p-1.5 rounded-xl glass border border-card-border">
        <div className="flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-foreground/5 cursor-pointer text-[10px] font-bold text-muted transition-all uppercase tracking-wider">
          <Home size={14} className="text-brand-purple" />
          <span>Tipo</span>
          <ChevronRight size={10} className="rotate-90" />
        </div>
        <div className="w-px h-4 bg-card-border" />
        <div className="flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-foreground/5 cursor-pointer text-[10px] font-bold text-muted transition-all uppercase tracking-wider">
          <Tag size={14} className="text-brand-purple" />
          <span>Precio</span>
          <ChevronRight size={10} className="rotate-90" />
        </div>
        <div className="w-px h-4 bg-card-border" />
        <div className="flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-foreground/5 cursor-pointer text-[10px] font-bold text-muted transition-all uppercase tracking-wider">
          <MapPin size={14} className="text-brand-purple" />
          <span>Lugar</span>
          <ChevronRight size={10} className="rotate-90" />
        </div>
        <button className="ml-auto flex items-center gap-2 px-3 py-1 rounded-lg bg-foreground/5 text-[10px] font-bold text-foreground hover:bg-foreground/10 transition-all border border-card-border uppercase tracking-widest">
          <Filter size={12} />
          Filtros
        </button>
      </div>

      {/* Property Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {properties.map((prop, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            key={prop.id} 
            className="group glass rounded-xl overflow-hidden border border-card-border hover:border-brand-purple/30 transition-all"
          >
            <div className="relative h-40 bg-foreground/5 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <img src={prop.image} alt={prop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              
              <div className="absolute top-3 left-3 z-20 flex gap-2">
                <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${
                  prop.status === 'Disponible' ? 'bg-emerald-500 text-white' : 
                  prop.status === 'Reservado' ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'
                }`}>
                  {prop.status}
                </span>
              </div>
              
              <button className="absolute top-3 right-3 z-20 p-1.5 rounded-lg glass text-white hover:text-red-400 transition-colors">
                <Heart size={14} />
              </button>

              <div className="absolute bottom-3 left-3 z-20">
                <p className="text-lg font-black text-white tracking-tight">{prop.price}</p>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-bold text-sm group-hover:text-brand-purple transition-colors truncate leading-tight">{prop.title}</h3>
                <div className="flex items-center gap-1 text-muted text-[10px] mt-0.5 font-medium">
                  <MapPin size={10} />
                  {prop.location}
                </div>
              </div>

              <div className="flex items-center justify-between py-2 border-y border-card-border">
                <div className="flex flex-col items-center gap-0.5">
                  <BedDouble size={14} className="text-brand-purple" />
                  <span className="text-[9px] text-muted font-bold">{prop.beds} Hab.</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <Bath size={14} className="text-brand-purple" />
                  <span className="text-[9px] text-muted font-bold">{prop.baths} Baños</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <Square size={14} className="text-brand-purple" />
                  <span className="text-[9px] text-muted font-bold">{prop.area}</span>
                </div>
              </div>

              <button 
                onClick={() => handleOpenModal(prop)}
                className="w-full py-1.5 rounded-lg bg-foreground/5 text-[11px] font-bold hover:bg-brand-purple hover:text-white transition-all flex items-center justify-center gap-1.5"
              >
                Ver Detalles
                <ChevronRight size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
