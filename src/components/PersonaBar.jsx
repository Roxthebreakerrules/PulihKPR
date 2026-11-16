import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { PERSONAS } from '../data/personas.js';

export default function PersonaBar({ activePersonaId, onSelectPersona }) {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-btn-navy-dark to-slate-900 text-white py-3 px-4 sm:px-6 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-xs sm:text-sm font-medium text-slate-200">
          <Sparkles className="w-4 h-4 text-btn-orange flex-shrink-0 animate-pulse" />
          <span><strong className="text-white">Uji Coba Dewan Juri:</strong> Muat profil studi kasus nyata dalam 1-klik:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {PERSONAS.map((persona) => {
            const isActive = activePersonaId === persona.id;
            return (
              <button
                key={persona.id}
                onClick={() => onSelectPersona(persona)}
                className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-btn-orange text-white shadow-md shadow-btn-orange/30 scale-105 ring-2 ring-white/30'
                    : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10'
                }`}
              >
                <span>{persona.avatar}</span>
                <span>{persona.name}</span>
                <span className="text-[10px] opacity-80 hidden lg:inline">({persona.role})</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
