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
  { id: '1', title: 'Modern Beachfront Villa', price: '$2.5M', location: 'Malibu, CA', type: 'House', beds: 5, baths: 4, area: '4,500 sqft', status: 'Available', image: '/api/placeholder/400/250' },
  { id: '2', title: 'Penthouse Downtown', price: '$1.2M', location: 'Miami, FL', type: 'Apartment', beds: 3, baths: 2, area: '2,200 sqft', status: 'Reserved', image: '/api/placeholder/400/250' },
  { id: '3', title: 'Luxury Estate', price: '$4.8M', location: 'Beverly Hills, CA', type: 'House', beds: 7, baths: 6, area: '8,200 sqft', status: 'Available', image: '/api/placeholder/400/250' },
  { id: '4', title: 'Cozy Modern Loft', price: '$850k', location: 'Brooklyn, NY', type: 'Apartment', beds: 2, baths: 1, area: '1,500 sqft', status: 'Sold', image: '/api/placeholder/400/250' },
  { id: '5', title: 'Suburban Family Home', price: '$600k', location: 'Austin, TX', type: 'House', beds: 4, baths: 3, area: '3,000 sqft', status: 'Available', image: '/api/placeholder/400/250' },
  { id: '6', title: 'Commercial Office Space', price: '$3.5M', location: 'Chicago, IL', type: 'Commercial', beds: 0, baths: 4, area: '12,000 sqft', status: 'Available', image: '/api/placeholder/400/250' },
];

export default function PropertiesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  const handleOpenModal = (prop?: any) => {
    setSelectedProperty(prop);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PropertyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        property={selectedProperty} 
      />
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-outfit tracking-tight">Property Inventory</h1>
          <p className="text-gray-400 text-sm mt-1">Manage and track your real estate listings.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search by location or name..." 
              className="pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-brand-purple/50 transition-all w-72"
            />
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-brand text-white text-sm font-semibold shadow-lg shadow-brand-purple/20 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            Add Property
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap gap-4 items-center p-2 rounded-2xl glass border border-white/5">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/5 cursor-pointer text-xs text-gray-400 transition-all">
          <Home className="w-4 h-4 text-brand-purple" />
          <span>Property Type</span>
          <ChevronRight className="w-3 h-3 rotate-90" />
        </div>
        <div className="w-px h-6 bg-white/10" />
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/5 cursor-pointer text-xs text-gray-400 transition-all">
          <Tag className="w-4 h-4 text-brand-purple" />
          <span>Price Range</span>
          <ChevronRight className="w-3 h-3 rotate-90" />
        </div>
        <div className="w-px h-6 bg-white/10" />
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/5 cursor-pointer text-xs text-gray-400 transition-all">
          <MapPin className="w-4 h-4 text-brand-purple" />
          <span>Location</span>
          <ChevronRight className="w-3 h-3 rotate-90" />
        </div>
        <button className="ml-auto flex items-center gap-2 px-4 py-1.5 rounded-xl bg-white/5 text-xs font-semibold text-white hover:bg-white/10 transition-all border border-white/5">
          <Filter className="w-3 h-3" />
          Advanced Filters
        </button>
      </div>

      {/* Property Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((prop, idx) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            key={prop.id} 
            className="group glass rounded-2xl overflow-hidden border border-white/5 hover:border-brand-purple/30 transition-all"
          >
            <div className="relative h-48 bg-gray-800 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
              <img src={prop.image} alt={prop.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              
              <div className="absolute top-4 left-4 z-20 flex gap-2">
                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                  prop.status === 'Available' ? 'bg-emerald-500 text-white' : 
                  prop.status === 'Reserved' ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'
                }`}>
                  {prop.status}
                </span>
              </div>
              
              <button className="absolute top-4 right-4 z-20 p-2 rounded-full glass text-white hover:text-red-400 transition-colors">
                <Heart className="w-4 h-4" />
              </button>

              <div className="absolute bottom-4 left-4 z-20">
                <p className="text-xl font-bold text-white tracking-tight">{prop.price}</p>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <h3 className="font-bold text-lg text-white group-hover:text-brand-purple transition-colors truncate">{prop.title}</h3>
                <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
                  <MapPin className="w-3 h-3" />
                  {prop.location}
                </div>
              </div>

              <div className="flex items-center justify-between py-3 border-y border-white/5">
                <div className="flex flex-col items-center gap-1">
                  <BedDouble className="w-4 h-4 text-brand-purple" />
                  <span className="text-[10px] text-gray-400">{prop.beds} Beds</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Bath className="w-4 h-4 text-brand-purple" />
                  <span className="text-[10px] text-gray-400">{prop.baths} Baths</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Square className="w-4 h-4 text-brand-purple" />
                  <span className="text-[10px] text-gray-400">{prop.area}</span>
                </div>
              </div>

              <button 
                onClick={() => handleOpenModal(prop)}
                className="w-full py-2.5 rounded-xl bg-white/5 text-sm font-semibold text-white group-hover:bg-brand-purple transition-all flex items-center justify-center gap-2"
              >
                View Details
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
