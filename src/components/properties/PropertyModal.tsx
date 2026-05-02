"use client";

import React, { useState } from 'react';
import { X, Upload, Plus, MapPin, DollarSign, Home, Info, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/Toast';

export function PropertyModal({ isOpen, onClose, property }: { isOpen: boolean, onClose: () => void, property?: any }) {
  const { showToast } = useToast();
  const [images, setImages] = useState<string[]>(property?.images || []);
  const [uploading, setUploading] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploading(true);
      // Simulate upload
      setTimeout(() => {
        setImages([...images, URL.createObjectURL(e.target.files![0])]);
        setUploading(false);
        showToast('Image uploaded successfully', 'success');
      }, 1500);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl glass rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row h-[80vh]"
          >
            {/* Left: Image Management */}
            <div className="w-full md:w-1/2 bg-white/5 p-6 flex flex-col gap-6 overflow-y-auto border-r border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-brand-purple" />
                  Property Gallery
                </h3>
                <label className="cursor-pointer p-2 rounded-xl bg-brand-purple/10 text-brand-purple hover:bg-brand-purple/20 transition-all">
                  <Upload className="w-4 h-4" />
                  <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {images.map((img, i) => (
                  <div key={i} className="relative aspect-video rounded-xl overflow-hidden group">
                    <img src={img} className="w-full h-full object-cover" alt="" />
                    <button className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
                {uploading && (
                  <div className="aspect-video rounded-xl bg-white/5 border border-dashed border-white/20 flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-brand-purple/30 border-t-brand-purple rounded-full animate-spin" />
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Uploading...</span>
                  </div>
                )}
                <label className="aspect-video rounded-xl bg-white/5 border border-dashed border-white/20 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/10 transition-all group">
                  <Plus className="w-6 h-6 text-gray-500 group-hover:text-brand-purple transition-all" />
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Add Image</span>
                  <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
                </label>
              </div>
            </div>

            {/* Right: Details Form */}
            <div className="flex-1 p-8 overflow-y-auto space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold font-outfit">{property?.title || 'Add New Property'}</h2>
                  <p className="text-gray-400 text-sm mt-1">Fill in the details to update your inventory.</p>
                </div>
                <button onClick={onClose} className="p-2 rounded-full glass-hover text-gray-500 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Price</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input type="text" defaultValue={property?.price} className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-brand-purple/50" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Type</label>
                  <div className="relative">
                    <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <select className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none appearance-none">
                      <option>House</option>
                      <option>Apartment</option>
                      <option>Commercial</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input type="text" defaultValue={property?.location} className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-brand-purple/50" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Description</label>
                <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-brand-purple/50 resize-none" placeholder="Enter property description..." />
              </div>

              <div className="flex items-center gap-4 pt-6">
                <button onClick={onClose} className="flex-1 py-3 rounded-xl glass-hover text-sm font-semibold border border-white/10 transition-all">
                  Cancel
                </button>
                <button onClick={() => { showToast('Property saved successfully', 'success'); onClose(); }} className="flex-[2] py-3 rounded-xl bg-gradient-brand text-white text-sm font-bold shadow-lg shadow-brand-purple/20 hover:scale-[1.02] transition-all">
                  Save Property
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
