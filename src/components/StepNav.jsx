import React from 'react';
import { Check, Calculator, GitBranch, CalendarCheck, PiggyBank, Award } from 'lucide-react';

const STEPS = [
  { id: 1, name: 'Quick Audit', icon: Calculator, desc: 'DSR & SLIK Scanner' },
  { id: 2, name: 'Peta Jalan Triage', icon: GitBranch, desc: 'Strategi Pelunasan & SKL' },
  { id: 3, name: '180-Day Streak', icon: CalendarCheck, desc: 'Rekening Bersih' },
  { id: 4, name: 'Tabungan BTN', icon: PiggyBank, desc: 'Uji Payment Shock' },
  { id: 5, name: 'Rapor Pra-Akad', icon: Award, desc: 'Sertifikat & Unduh PDF' },
];

export default function StepNav({ currentStep, onStepClick }) {
  return (
    <nav className="bg-white border-b border-slate-200 py-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-5 gap-2 sm:gap-4">
          {STEPS.map((step) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            const Icon = step.icon;

            return (
              <button
                key={step.id}
                onClick={() => onStepClick(step.id)}
                className={`flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left p-2 rounded-xl transition-all ${
                  isCurrent
                    ? 'bg-blue-50/80 border border-btn-navy/20 text-btn-navy shadow-sm'
                    : isCompleted
                    ? 'text-emerald-700 hover:bg-slate-50'
                    : 'text-slate-400 hover:bg-slate-50'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 sm:mr-2.5 text-xs font-bold ${
                    isCurrent
                      ? 'bg-btn-navy text-white shadow-sm'
                      : isCompleted
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Icon className="w-4 h-4" />}
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-bold leading-tight">
                    {step.id}. {step.name}
                  </div>
                  <div className="text-[10px] text-slate-500 leading-tight truncate">
                    {step.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
