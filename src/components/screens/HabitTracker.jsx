import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Flame, Award, CheckCircle2, Calendar, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function HabitTracker({ userData, onUpdateUserData, onBack, onNext }) {
  const currentStreak = userData.streakDays || 180;

  const BADGES = [
    {
      id: 'bronze',
      minDays: 30,
      title: 'Bronze: Disiplin 30 Hari',
      desc: 'Berhasil menghentikan transaksi impulsif dan penarikan pinjaman baru.',
      icon: '🥉',
      unlocked: currentStreak >= 30,
    },
    {
      id: 'silver',
      minDays: 90,
      title: 'Silver: Arus Kas Sehat 90 Hari',
      desc: 'Tiga bulan mutasi rekening koran bersih tanpa catatan red-flag.',
      icon: '🥈',
      unlocked: currentStreak >= 90,
    },
    {
      id: 'gold',
      minDays: 180,
      title: 'Gold: Debitur Prima 180 Hari',
      desc: 'Lulus penuh program cooling-off. Memenuhi standar underwriting analis BTN.',
      icon: '🥇',
      unlocked: currentStreak >= 180,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <span className="text-xs font-bold uppercase tracking-wider text-btn-orange">
          Langkah 3 dari 5 — Pembentukan Perilaku Finansial
        </span>
        <h1 className="text-2xl font-extrabold text-btn-navy mt-1">
          180-Day Cooling-Off & Kalender Rekening Bersih
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Bank BTN mensyaratkan mutasi rekening koran 3–6 bulan terakhir yang sehat. Platform ini memandu pembiasaan harian agar riwayat perbankan Anda bersih dari transaksi berisiko.
        </p>
      </div>

      {/* Main Streak Counter & Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Streak Tracker (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-btn-orange shadow-inner">
                  <Flame className="w-7 h-7 text-btn-orange animate-bounce" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Total Hari Rekening Bersih
                  </span>
                  <div className="text-3xl font-black text-slate-900">
                    {currentStreak} <span className="text-base font-bold text-slate-500">/ 180 Hari</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                  Status: Memenuhi Syarat
                </span>
              </div>
            </div>

            {/* Streak Slider Simulator */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Simulasi Progres Hari Disiplin:</span>
                <span className="text-btn-navy font-extrabold">{currentStreak} Hari</span>
              </div>
              <input
                type="range"
                min="0"
                max="180"
                step="1"
                value={currentStreak}
                onChange={(e) => onUpdateUserData({ ...userData, streakDays: Number(e.target.value) })}
                className="w-full accent-btn-orange cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Hari 0 (Mulai)</span>
                <span>Hari 90 (Evaluasi Tengah)</span>
                <span>Hari 180 (Lulus Uji)</span>
              </div>
            </div>

            {/* Visual Contribution Grid (Simulasi 26 Minggu / 180 Hari) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Peta Rekam Jejak 26 Minggu Bebas Transaksi Berisiko:</span>
                <span className="text-[10px] text-slate-500">Hijau = Hari Bersih</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 overflow-x-auto">
                <div className="grid grid-flow-col grid-rows-7 gap-1 min-w-[500px]">
                  {Array.from({ length: 180 }).map((_, index) => {
                    const isPassed = index < currentStreak;
                    return (
                      <div
                        key={index}
                        title={`Hari ke-${index + 1}: ${isPassed ? 'Rekening Bersih Terverifikasi' : 'Belum Terlewati'}`}
                        className={`w-3 h-3 rounded-sm transition-colors ${
                          isPassed
                            ? 'bg-emerald-500 shadow-sm'
                            : 'bg-slate-200'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Badges & Guidelines (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-btn-navy flex items-center space-x-2">
              <Award className="w-5 h-5 text-btn-orange" />
              <span>Milestone Pencapaian & Lencana</span>
            </h3>

            <div className="space-y-3">
              {BADGES.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    badge.unlocked
                      ? 'bg-blue-50/60 border-blue-200 text-slate-900 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{badge.icon}</span>
                    <div>
                      <div className="text-xs font-extrabold flex items-center space-x-1.5">
                        <span>{badge.title}</span>
                        {badge.unlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />}
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">{badge.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Habit Commitments */}
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs space-y-1.5">
              <div className="font-bold flex items-center space-x-1.5">
                <HeartHandshake className="w-4 h-4 text-emerald-700" />
                <span>3 Komitmen Pokok Peserta PulihKPR:</span>
              </div>
              <ul className="list-disc pl-4 text-[11px] space-y-1 text-emerald-900">
                <li>Nol transaksi baru ke platform pinjaman online atau paylater.</li>
                <li>Nol transaksi deposit ke rekening judi/taruhan online.</li>
                <li>Konsisten menyetor saldo tabungan komitmen cicilan KPR setiap tanggal gajian.</li>
              </ul>
            </div>

            {/* Back & Next Navigation */}
            <div className="flex space-x-3 pt-4 border-t border-slate-100">
              <button
                onClick={onBack}
                className="w-1/3 py-3 px-4 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors flex items-center justify-center space-x-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>
              <button
                onClick={onNext}
                className="w-2/3 py-3 px-4 rounded-xl bg-btn-navy hover:bg-btn-navy-hover text-white text-xs font-bold shadow-md shadow-btn-navy/20 flex items-center justify-center space-x-2 transition-all"
              >
                <span>Lanjut ke Tabungan BTN</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
