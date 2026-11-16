import React from 'react';
import { ShieldCheck, Building2, Sparkles, RefreshCw } from 'lucide-react';

export default function Navbar({ onReset }) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-btn-navy flex items-center justify-center text-white shadow-md shadow-btn-navy/20">
              <Building2 className="w-6 h-6 text-btn-orange" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight text-btn-navy">
                  Pulih<span className="text-btn-orange">KPR</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-btn-navy border border-blue-200">
                  by BTN Ecosystem
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Infrastruktur Holding Room & Jembatan Kesiapan Pra-Akad
              </p>
            </div>
          </div>

          {/* Badges & Actions */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Zero-Knowledge (UU PDP Safe)</span>
            </div>
            <button
              onClick={onReset}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-btn-navy hover:bg-slate-100 transition-colors border border-slate-200"
              title="Reset data formulir"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Form</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
