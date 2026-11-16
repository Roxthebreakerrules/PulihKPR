import React, { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import PersonaBar from './components/PersonaBar.jsx';
import StepNav from './components/StepNav.jsx';
import AuditWizard from './components/screens/AuditWizard.jsx';
import TriageRoadmap from './components/screens/TriageRoadmap.jsx';
import HabitTracker from './components/screens/HabitTracker.jsx';
import SavingsSimulator from './components/screens/SavingsSimulator.jsx';
import ReportCertificate from './components/screens/ReportCertificate.jsx';
import { PERSONAS } from './data/personas.js';

// Default initial state (starts with Persona 1: Mas Rian for ready demonstration)
const DEFAULT_USER = PERSONAS[0];

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [activePersonaId, setActivePersonaId] = useState(DEFAULT_USER.id);
  const [userData, setUserData] = useState(DEFAULT_USER);

  const handleSelectPersona = (persona) => {
    setActivePersonaId(persona.id);
    setUserData({ ...persona });
  };

  const handleReset = () => {
    setActivePersonaId(null);
    setUserData({
      name: '',
      role: '',
      income: 5000000,
      livingCost: 2500000,
      targetKprType: 'flpp',
      debts: [],
      riskyTransactions: {
        hasJudolHistory: false,
        hasImpulsiveTopups: false,
        hasMultiplePaylaterLate: false,
      },
      streakDays: 180,
      savingsMonthly: 1500000,
    });
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* 1. Official BTN Ecosystem Navigation */}
      <Navbar onReset={handleReset} />

      {/* 2. Jury 1-Click Persona Demo Bar */}
      <PersonaBar
        activePersonaId={activePersonaId}
        onSelectPersona={handleSelectPersona}
      />

      {/* 3. Five-Step Wizard Navigation */}
      <StepNav
        currentStep={currentStep}
        onStepClick={(stepId) => setCurrentStep(stepId)}
      />

      {/* 4. Active Screen Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === 1 && (
          <AuditWizard
            userData={userData}
            onUpdateUserData={setUserData}
            onNext={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 2 && (
          <TriageRoadmap
            userData={userData}
            onBack={() => setCurrentStep(1)}
            onNext={() => setCurrentStep(3)}
          />
        )}

        {currentStep === 3 && (
          <HabitTracker
            userData={userData}
            onUpdateUserData={setUserData}
            onBack={() => setCurrentStep(2)}
            onNext={() => setCurrentStep(4)}
          />
        )}

        {currentStep === 4 && (
          <SavingsSimulator
            userData={userData}
            onUpdateUserData={setUserData}
            onBack={() => setCurrentStep(3)}
            onNext={() => setCurrentStep(5)}
          />
        )}

        {currentStep === 5 && (
          <ReportCertificate
            userData={userData}
            onBack={() => setCurrentStep(4)}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-btn-navy">PulihKPR</span>
            <span>&bull;</span>
            <span>Inkubasi Kesiapan Kredit & Holding Room Bank BTN</span>
          </div>
          <div>
            Karya Kompetisi <strong>BTN Housingpreneur Batch 3</strong> (Kategori: <em>Housing Innovation</em>)
          </div>
        </div>
      </footer>
    </div>
  );
}
