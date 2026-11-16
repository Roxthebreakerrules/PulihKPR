import React, { useState } from 'react';
import { Plus, Trash2, AlertTriangle, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { formatRupiah, calculateDSR, getDSRStatus, calculateTotalInstallments, calculateTotalPrincipal, calculateMaxKprInstallment } from '../../utils/financialCalculators.js';

export default function AuditWizard({ userData, onUpdateUserData, onNext }) {
  const [newDebt, setNewDebt] = useState({
    creditorName: '',
    creditorType: 'paylater',
    remainingPrincipal: '',
    monthlyInstallment: '',
    kolStatus: 1,
  });

  const totalInstallments = calculateTotalInstallments(userData.debts);
  const totalPrincipal = calculateTotalPrincipal(userData.debts);
  const dsr = calculateDSR(userData.income, totalInstallments);
  const dsrStatus = getDSRStatus(dsr);
  const kprCap = calculateMaxKprInstallment(userData.income, totalInstallments);

  const handleAddDebt = (e) => {
    e.preventDefault();
    if (!newDebt.creditorName || !newDebt.remainingPrincipal || !newDebt.monthlyInstallment) return;

    const debtItem = {
      id: 'debt-' + Date.now(),
      creditorName: newDebt.creditorName,
      creditorType: newDebt.creditorType,
      remainingPrincipal: Number(newDebt.remainingPrincipal),
      monthlyInstallment: Number(newDebt.monthlyInstallment),
      kolStatus: Number(newDebt.kolStatus) || 1,
    };

    onUpdateUserData({
      ...userData,
      debts: [...userData.debts, debtItem],
    });

    setNewDebt({
      creditorName: '',
      creditorType: 'paylater',
      remainingPrincipal: '',
      monthlyInstallment: '',
      kolStatus: 1,
    });
  };

  const handleRemoveDebt = (id) => {
    onUpdateUserData({
      ...userData,
      debts: userData.debts.filter((d) => d.id !== id),
    });
  };

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-btn-orange">
              Langkah 1 dari 5 — Self-Assessment
            </span>
            <h1 className="text-2xl font-extrabold text-btn-navy mt-1">
              KPR Red-Flag Audit & Kalkulator DSR
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Identifikasi faktor risiko yang berpotensi memicu penolakan berkas KPR di meja analis Bank BTN. Data diproses 100% lokal di browser Anda.
            </p>
          </div>
          <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold self-start md:self-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Aman UU PDP No. 27/2022</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Income & Debts (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Income & Living Cost */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-btn-navy"></span>
              <span>1. Penghasilan & Pengeluaran Pokok Bulanan</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Penghasilan Bersih (Take-Home Pay) *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-bold text-slate-400">
                    Rp
                  </span>
                  <input
                    type="number"
                    value={userData.income || ''}
                    onChange={(e) => onUpdateUserData({ ...userData, income: Number(e.target.value) })}
                    placeholder="Contoh: 5500000"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-btn-navy focus:border-transparent"
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">Gaji pokok + tunjangan tetap</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Biaya Hidup Minimal (Living Cost) *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-bold text-slate-400">
                    Rp
                  </span>
                  <input
                    type="number"
                    value={userData.livingCost || ''}
                    onChange={(e) => onUpdateUserData({ ...userData, livingCost: Number(e.target.value) })}
                    placeholder="Contoh: 2500000"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-btn-navy focus:border-transparent"
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">Makan, kos/tempat tinggal, utilitas</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Produk Pembiayaan Rumah BTN
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'flpp', name: 'KPR Bersubsidi (FLPP)', desc: 'Bunga 5% fixed s.d. 20th' },
                  { id: 'platinum', name: 'KPR BTN Platinum Gaess', desc: 'Rumah komersial baru/second' },
                  { id: 'kbr', name: 'Kredit Bangun Rumah', desc: 'Bangun di kavling sendiri' },
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => onUpdateUserData({ ...userData, targetKprType: type.id })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      userData.targetKprType === type.id
                        ? 'border-btn-navy bg-blue-50/70 text-btn-navy ring-1 ring-btn-navy'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{type.name}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{type.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Debt / Liabilities */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-btn-navy"></span>
                <span>2. Daftar Utang Aktif (Pinjol, Paylater, CC, KTA)</span>
              </h2>
              <span className="text-xs font-bold text-slate-500">
                {userData.debts.length} Akun Terdaftar
              </span>
            </div>

            {/* Existing Debt List */}
            {userData.debts.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-500">
                Belum ada utang yang dicatat. Tambahkan di bawah jika memiliki cicilan berjalan.
              </div>
            ) : (
              <div className="space-y-2.5">
                {userData.debts.map((debt) => (
                  <div
                    key={debt.id}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-colors"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900">{debt.creditorName}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-800">
                          {debt.creditorType}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            debt.kolStatus === 1
                              ? 'bg-emerald-100 text-emerald-800'
                              : debt.kolStatus === 2
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          Kol {debt.kolStatus}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Sisa Pokok: <strong className="text-slate-700">{formatRupiah(debt.remainingPrincipal)}</strong> | Cicilan: <strong className="text-slate-700">{formatRupiah(debt.monthlyInstallment)}/bln</strong>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveDebt(debt.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Hapus utang"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Debt Form */}
            <form onSubmit={handleAddDebt} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-700 block">+ Tambah Akun Pinjaman</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Nama Kreditur (misal: Shopee Paylater)"
                  value={newDebt.creditorName}
                  onChange={(e) => setNewDebt({ ...newDebt, creditorName: e.target.value })}
                  className="px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-btn-navy bg-white"
                />
                <select
                  value={newDebt.creditorType}
                  onChange={(e) => setNewDebt({ ...newDebt, creditorType: e.target.value })}
                  className="px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-btn-navy bg-white"
                >
                  <option value="paylater">Paylater (GoPay, Shopee, Traveloka)</option>
                  <option value="pinjol_legal">Pinjol P2P Lending</option>
                  <option value="cc">Kartu Kredit Bank</option>
                  <option value="multiguna">Kredit Motor / KTA</option>
                </select>
                <input
                  type="number"
                  placeholder="Sisa Pokok Utang (Rp)"
                  value={newDebt.remainingPrincipal}
                  onChange={(e) => setNewDebt({ ...newDebt, remainingPrincipal: e.target.value })}
                  className="px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-btn-navy bg-white"
                />
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Cicilan / bln (Rp)"
                    value={newDebt.monthlyInstallment}
                    onChange={(e) => setNewDebt({ ...newDebt, monthlyInstallment: e.target.value })}
                    className="w-2/3 px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-btn-navy bg-white"
                  />
                  <select
                    value={newDebt.kolStatus}
                    onChange={(e) => setNewDebt({ ...newDebt, kolStatus: Number(e.target.value) })}
                    className="w-1/3 px-2 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-btn-navy bg-white"
                    title="Status Kolektibilitas OJK"
                  >
                    <option value="1">Kol 1 (Lancar)</option>
                    <option value="2">Kol 2 (DPK/Telat)</option>
                    <option value="3">Kol 3 (Kurang Lancar)</option>
                    <option value="4">Kol 4 (Diragukan)</option>
                    <option value="5">Kol 5 (Macet/Galbay)</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition-colors"
              >
                Simpan ke Daftar Utang
              </button>
            </form>
          </div>

          {/* Risky Transactions Scanner */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-btn-orange"></span>
              <span>3. Pemindai Red-Flag Mutasi Rekening (3–6 Bulan Terakhir)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Analis kredit memeriksa mutasi rekening koran untuk mendeteksi transaksi anomali. Centang jika Anda pernah melakukan hal berikut:
            </p>

            <div className="space-y-3">
              {[
                {
                  key: 'hasJudolHistory',
                  title: 'Riwayat Transaksi ke Platform Judi Online / Taruhan',
                  desc: 'Pernah transfer deposit ke rekening/e-wallet penampung situs judi (Penyebab nomor 1 auto-reject analis)',
                },
                {
                  key: 'hasImpulsiveTopups',
                  title: 'Top-Up E-Wallet Berulang pada Jam Malam / Dini Hari',
                  desc: 'Pola mutasi berulang tanpa jeda yang mengindikasikan pengeluaran impulsif tanpa perencanaan',
                },
                {
                  key: 'hasMultiplePaylaterLate',
                  title: 'Keterlambatan Bayar Paylater Lebih dari 3 Kali dalam 6 Bulan',
                  desc: 'Meskipun sudah dilunasi, riwayat keterlambatan berulang menurunkan scoring internal bank',
                },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-start space-x-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={userData.riskyTransactions?.[item.key] || false}
                    onChange={(e) =>
                      onUpdateUserData({
                        ...userData,
                        riskyTransactions: {
                          ...userData.riskyTransactions,
                          [item.key]: e.target.checked,
                        },
                      })
                    }
                    className="mt-0.5 w-4 h-4 text-btn-navy rounded border-slate-300 focus:ring-btn-navy"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-800">{item.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel: Live Financial Health Scorecard (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm sticky top-24 space-y-6">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-btn-navy flex items-center justify-between">
              <span>Hasil Audit Real-Time</span>
              <span className="text-[10px] font-semibold text-slate-500">Standar Underwriting BTN</span>
            </h3>

            {/* DSR Gauge */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Debt Service Ratio (DSR)
              </span>
              <div className="flex items-center justify-center space-x-2">
                <span
                  className={`text-5xl font-black ${
                    dsrStatus.level === 'SEHAT'
                      ? 'text-emerald-600'
                      : dsrStatus.level === 'WASPADA'
                      ? 'text-amber-600'
                      : 'text-rose-600'
                  }`}
                >
                  {dsr}%
                </span>
              </div>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-white shadow-sm border border-slate-200">
                {dsrStatus.badge}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed px-2">
                {dsrStatus.description}
              </p>
            </div>

            {/* Metrics Breakdown */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Penghasilan Bersih</span>
                <span className="font-bold text-slate-900">{formatRupiah(userData.income)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Total Cicilan Bulanan Berjalan</span>
                <span className="font-bold text-rose-600">{formatRupiah(totalInstallments)} / bln</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Total Pokok Utang Tersisa</span>
                <span className="font-bold text-slate-900">{formatRupiah(totalPrincipal)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Batas Aman Cicilan Bank (35%)</span>
                <span className="font-bold text-slate-900">{formatRupiah(kprCap.maxAllowedTotal)} / bln</span>
              </div>
              <div className="flex justify-between py-2 bg-blue-50/60 p-2.5 rounded-xl border border-blue-100">
                <span className="font-bold text-btn-navy">Sisa Kapasitas Cicilan KPR</span>
                <span className="font-extrabold text-btn-navy">
                  {formatRupiah(kprCap.availableKprInstallment)} / bln
                </span>
              </div>
            </div>

            {/* Red Flag Warning */}
            {userData.riskyTransactions?.hasJudolHistory && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Terdeteksi Riwayat Transaksi Berisiko:</strong>
                  <p className="mt-0.5 text-[11px] leading-relaxed">
                    Wajib menjalani masa karantina (cooling-off) minimal 180 hari rekening bersih tanpa transaksi serupa sebelum mengajukan berkas ke analis BTN.
                  </p>
                </div>
              </div>
            )}

            {/* Next Button */}
            <button
              onClick={onNext}
              className="w-full py-3.5 px-6 rounded-xl bg-btn-navy hover:bg-btn-navy-hover text-white text-sm font-bold shadow-md shadow-btn-navy/20 flex items-center justify-center space-x-2 transition-all transform active:scale-[0.99]"
            >
              <span>Lanjut ke Analisis & Peta Jalan Triage</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
