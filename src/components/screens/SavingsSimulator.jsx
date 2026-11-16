import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, PiggyBank, Landmark, CheckCircle, TrendingUp, ShieldAlert, Sparkles } from 'lucide-react';
import { formatRupiah, simulateBtnSavings } from '../../utils/financialCalculators.js';

export default function SavingsSimulator({ userData, onUpdateUserData, onBack, onNext }) {
  const [monthlyCommitment, setMonthlyCommitment] = useState(
    userData.savingsMonthly || userData.estimatedKprInstallment || 1500000
  );
  const [durationMonths, setDurationMonths] = useState(6);
  const [initialDeposit, setInitialDeposit] = useState(500000);

  const savingsSim = simulateBtnSavings(monthlyCommitment, durationMonths, initialDeposit);

  const handleUpdate = (val) => {
    setMonthlyCommitment(val);
    onUpdateUserData({
      ...userData,
      savingsMonthly: val,
    });
  };

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <span className="text-xs font-bold uppercase tracking-wider text-btn-orange">
          Langkah 4 dari 5 — Pembuktian Kapasitas Bayar
        </span>
        <h1 className="text-2xl font-extrabold text-btn-navy mt-1">
          Tabungan Komitmen BTN & Uji Ketahanan Kas (Payment Shock)
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Sebelum kredit dicairkan, Anda membuktikan kapasitas bayar dengan menyetor komitmen cicilan bulanan ke produk simpanan Bank BTN. Dana yang terkumpul menjadi modal Down Payment (DP) dan biaya akad resmi Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Simulator Controls & Breakdown (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <PiggyBank className="w-5 h-5 text-btn-navy" />
              <span>Simulasi Setoran Tabungan BTN Siap / Batara</span>
            </h2>

            {/* Slider Setoran Bulanan */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Komitmen Setoran Bulanan (Setara Cicilan KPR):</span>
                <span className="text-btn-navy font-extrabold text-sm">{formatRupiah(monthlyCommitment)} / bln</span>
              </div>
              <input
                type="range"
                min="1000000"
                max="5000000"
                step="50000"
                value={monthlyCommitment}
                onChange={(e) => handleUpdate(Number(e.target.value))}
                className="w-full accent-btn-navy cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Rp 1.000.000 (KPR Subsidi)</span>
                <span>Rp 2.500.000 (KPR Gaess)</span>
                <span>Rp 5.000.000 (Platinum)</span>
              </div>
            </div>

            {/* Durasi & Saldo Awal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-500 block mb-1">Durasi Uji Pembiasaan</span>
                <div className="text-sm font-extrabold text-btn-navy">
                  {durationMonths} Bulan (180 Hari Kalender)
                </div>
                <span className="text-[11px] text-slate-500 mt-0.5 block">Siklus audit mutasi standar BTN</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-500 block mb-1">Setoran Awal Pembukaan</span>
                <div className="text-sm font-extrabold text-btn-navy">
                  {formatRupiah(initialDeposit)}
                </div>
                <span className="text-[11px] text-slate-500 mt-0.5 block">Minimal saldo mengendap rekening</span>
              </div>
            </div>

            {/* Monthly Growth Table */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-slate-700 block">
                Rencana Akumulasi Saldo Tabungan Terkunci (6 Bulan):
              </span>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
                {savingsSim.monthlyBreakdown.map((item) => (
                  <div key={item.month} className="p-3 bg-white hover:bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-btn-navy flex items-center justify-center font-extrabold text-[10px]">
                        {item.month}
                      </span>
                      <div>
                        <span className="font-bold text-slate-800">{item.note}</span>
                        <div className="text-[11px] text-slate-500">+ Setoran {formatRupiah(monthlyCommitment)}</div>
                      </div>
                    </div>
                    <span className="font-extrabold text-slate-900">
                      {formatRupiah(item.balance)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: CASA Value & Down Payment Coverage (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-btn-navy flex items-center space-x-2">
              <Landmark className="w-5 h-5 text-btn-orange" />
              <span>Manfaat Finansial bagi Nasabah & Bank</span>
            </h3>

            {/* Total Accumulation Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-btn-navy to-btn-navy-dark text-white shadow-md shadow-btn-navy/20 space-y-2">
              <span className="text-xs font-bold text-blue-200 uppercase tracking-wider block">
                Total Tabungan Mandiri Terkumpul:
              </span>
              <div className="text-3xl font-black text-white">
                {formatRupiah(savingsSim.totalSaved)}
              </div>
              <p className="text-[11px] text-blue-100 leading-relaxed pt-1">
                Dana ini sepenuhnya milik Anda dan dikunci di rekening Bank BTN atas nama pribadi sebagai jaminan kesiapan DP & biaya akad.
              </p>
            </div>

            {/* Target DP Coverage Meter */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Cakupan Target DP & Biaya Akad (~Rp 12 Jt):</span>
                <span className="text-emerald-700 font-extrabold">{savingsSim.dpTargetCoveragePercent}% Terpenuhi</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${savingsSim.dpTargetCoveragePercent}%` }}
                />
              </div>
            </div>

            {/* Bank BTN Value Explanation */}
            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-btn-navy text-xs space-y-1.5 leading-relaxed">
              <strong className="font-extrabold block">Mengapa Juri Bank BTN Sangat Mengapresiasi Ini?</strong>
              <p className="text-[11px] text-slate-700">
                1. <strong>CASA Baru:</strong> Bank BTN menghimpun Dana Pihak Ketiga (DPK) berbiaya murah selama minimal 6 bulan sebelum pinjaman cair.<br />
                2. <strong>De-risking:</strong> Nasabah yang lolos uji 6 bulan terbukti memiliki disiplin kas tinggi, memangkas risiko NPL hingga 30%+.
              </p>
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
                className="w-2/3 py-3 px-4 rounded-xl bg-btn-orange hover:bg-btn-orange-hover text-white text-xs font-bold shadow-md shadow-btn-orange/20 flex items-center justify-center space-x-2 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Terbitkan Rapor Pra-Akad</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
