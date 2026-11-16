import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, GitBranch, AlertOctagon, CheckCircle2, FileText, Clock, TrendingDown } from 'lucide-react';
import { determineTriage, simulatePayoff, formatRupiah, calculateTotalPrincipal, calculateTotalInstallments } from '../../utils/financialCalculators.js';

export default function TriageRoadmap({ userData, onBack, onNext }) {
  const [strategy, setStrategy] = useState('avalanche'); // 'avalanche' | 'snowball'
  const [extraPayment, setExtraPayment] = useState(500000);

  const triage = determineTriage(userData.debts, userData.income, userData.livingCost);
  const payoffSim = simulatePayoff(userData.debts, Number(extraPayment) || 0, strategy);
  const totalPrincipal = calculateTotalPrincipal(userData.debts);
  const totalInstallments = calculateTotalInstallments(userData.debts);
  const monthlySurplus = Math.max(0, userData.income - userData.livingCost - totalInstallments);

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <span className="text-xs font-bold uppercase tracking-wider text-btn-orange">
          Langkah 2 dari 5 — Diagnosis & Strategi
        </span>
        <h1 className="text-2xl font-extrabold text-btn-navy mt-1">
          Peta Jalan Triage & Strategi Pelunasan Kredit
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Hasil evaluasi sistem perbankan untuk menentukan jalur pemulihan yang realistis, jadwal pelunasan terarah, serta panduan pengurusan Surat Keterangan Lunas (SKL).
        </p>
      </div>

      {/* Main Triage Banner */}
      <div
        className={`rounded-2xl p-6 border shadow-sm ${
          triage.trackId === 'RESTRUKTURISASI'
            ? 'bg-rose-50/70 border-rose-200 text-rose-950'
            : triage.trackId === 'MENENGAH'
            ? 'bg-amber-50/70 border-amber-200 text-amber-950'
            : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wide ${
                  triage.trackId === 'RESTRUKTURISASI'
                    ? 'bg-rose-600 text-white'
                    : triage.trackId === 'MENENGAH'
                    ? 'bg-amber-600 text-white'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                {triage.trackId}
              </span>
              <span className="text-xs font-bold text-slate-600">Estimasi Waktu: {triage.durationMonths}</span>
            </div>
            <h2 className="text-xl font-extrabold">{triage.title}</h2>
            <p className="text-xs leading-relaxed max-w-3xl opacity-90">{triage.summary}</p>
          </div>

          <div className="p-4 rounded-xl bg-white/90 border border-black/5 shadow-sm min-w-[220px]">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Rekomendasi Produk BTN
            </span>
            <span className="text-sm font-extrabold text-btn-navy mt-0.5 block">
              {triage.recommendedKpr}
            </span>
          </div>
        </div>

        {/* Action Plan Checklist */}
        <div className="mt-5 pt-5 border-t border-black/10">
          <span className="text-xs font-extrabold uppercase tracking-wider block mb-3">
            Rencana Tindakan Wajib (Action Plan):
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {triage.actionPlan.map((action, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-xs bg-white/80 p-2.5 rounded-lg border border-black/5">
                <CheckCircle2 className="w-4 h-4 text-btn-navy flex-shrink-0 mt-0.5" />
                <span>{action}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Payoff Simulator (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Simulasi Strategi Pelunasan Utang
                </h3>
                <p className="text-xs text-slate-500">Pilih algoritma pengurutan prioritas pembayaran</p>
              </div>

              {/* Strategy Toggle */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setStrategy('avalanche')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    strategy === 'avalanche'
                      ? 'bg-btn-navy text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Debt Avalanche
                </button>
                <button
                  onClick={() => setStrategy('snowball')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    strategy === 'snowball'
                      ? 'bg-btn-navy text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Debt Snowball
                </button>
              </div>
            </div>

            {/* Strategy Explanation */}
            <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-slate-700">
              {strategy === 'avalanche' ? (
                <>
                  <strong className="text-btn-navy font-bold">Metode Avalanche (Disarankan Bankir):</strong>{' '}
                  Memprioritaskan pelunasan pinjaman berbunga tertinggi (pinjol legal & paylater) agar terhindar dari pembengkakan bunga harian.
                </>
              ) : (
                <>
                  <strong className="text-btn-navy font-bold">Metode Snowball (Psikologis):</strong>{' '}
                  Memprioritaskan pelunasan utang dengan saldo pokok terkecil terlebih dahulu untuk memberi dorongan semangat mental.
                </>
              )}
            </div>

            {/* Extra Payment Slider */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span>Alokasi Tambahan Kas Bulanan untuk Pelunasan</span>
                <span className="text-btn-navy font-extrabold">{formatRupiah(extraPayment)} / bln</span>
              </div>
              <input
                type="range"
                min="0"
                max={Math.max(2000000, monthlySurplus)}
                step="100000"
                value={extraPayment}
                onChange={(e) => setExtraPayment(Number(e.target.value))}
                className="w-full accent-btn-navy cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>Rp 0</span>
                <span>Sisa Kas Bulanan Tersedia: {formatRupiah(monthlySurplus)}</span>
              </div>
            </div>

            {/* Payoff Queue Table */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">
                Urutan Prioritas Pelunasan ({payoffSim.sortedDebts.length} Akun):
              </span>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {payoffSim.sortedDebts.map((debt, index) => (
                  <div key={debt.id} className="p-3 bg-white hover:bg-slate-50 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-black text-[10px]">
                        {index + 1}
                      </span>
                      <div>
                        <div className="font-bold text-slate-900">{debt.creditorName}</div>
                        <div className="text-[11px] text-slate-500">
                          Sisa: {formatRupiah(debt.remainingPrincipal)} | Cicilan: {formatRupiah(debt.monthlyInstallment)}
                        </div>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      Target #{index + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: SKL & SLIK Guide (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-btn-navy flex items-center space-x-2">
              <FileText className="w-5 h-5 text-btn-orange" />
              <span>Panduan Legal: Surat Keterangan Lunas (SKL)</span>
            </h3>

            <div className="space-y-3.5 text-xs text-slate-600">
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 leading-relaxed">
                <strong>Mengapa SKL Sangat Penting bagi Analis BTN?</strong>
                <p className="mt-1 text-[11px]">
                  Meskipun utang sudah Anda transfer lunas, sistem SLIK OJK memiliki jeda pelaporan bulanan (30–60 hari). Selembar <strong>Surat Keterangan Lunas (SKL)</strong> resmi adalah satu-satunya bukti sah di meja analis kredit untuk bypass jeda tersebut.
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-800 block">Langkah Mengklaim SKL:</span>
                <ol className="list-decimal pl-4 space-y-1 text-slate-600">
                  <li>Transfer pelunasan utang sesuai nomor virtual account resmi aplikasi.</li>
                  <li>Simpan bukti transfer m-banking sebagai dokumen otentik.</li>
                  <li>Hubungi Customer Service resmi kreditur, minta diterbitkan Surat Keterangan Lunas bertanda tangan digital.</li>
                  <li>Periksa nama lengkap, NIK, dan tanggal lunas di dokumen SKL.</li>
                </ol>
              </div>
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
                <span>Lanjut ke Program 180 Hari</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
