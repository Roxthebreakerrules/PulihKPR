import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Download, Award, ShieldCheck, CheckCircle2, ArrowLeft, Building2, QrCode, Sparkles, Printer } from 'lucide-react';
import { formatRupiah, calculateDSR, calculateTotalPrincipal, calculateTotalInstallments, simulateBtnSavings } from '../../utils/financialCalculators.js';
import { generateReportPDF } from '../../utils/pdfGenerator.js';

export default function ReportCertificate({ userData, onBack, onReset }) {
  useEffect(() => {
    // Trigger celebratory confetti on certificate graduation
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0A3871', '#F37021', '#10B981'],
      });
    } catch (e) {
      // Confetti fallback
    }
  }, []);

  const totalInstallments = calculateTotalInstallments(userData.debts);
  const initialPrincipal = calculateTotalPrincipal(userData.debts);
  const initialDsr = calculateDSR(userData.income, totalInstallments);
  const finalDsr = 0; // After debt payoff & 180 days clean
  const monthlyCommitment = userData.savingsMonthly || userData.estimatedKprInstallment || 1500000;
  const savings = simulateBtnSavings(monthlyCommitment, 6, 500000);

  const reportPayload = {
    name: userData.name || 'Calon Debitur Teladan',
    income: userData.income,
    initialDsr: initialDsr,
    finalDsr: finalDsr,
    initialPrincipal: initialPrincipal,
    savingsAccumulation: savings.totalSaved,
    estimatedInstallment: monthlyCommitment,
    targetKprName:
      userData.targetKprType === 'flpp'
        ? 'KPR BTN Sejahtera FLPP (Subsidi)'
        : userData.targetKprType === 'kbr'
        ? 'Kredit Bangun Rumah (KBR)'
        : 'KPR BTN Platinum Gaess',
  };

  const handleDownload = () => {
    generateReportPDF(reportPayload);
  };

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-btn-orange" />
            <span>Langkah 5 dari 5 — Kelulusan Program</span>
          </span>
          <h1 className="text-2xl font-extrabold text-btn-navy mt-1">
            Rapor Kesiapan Pra-Akad Bank BTN
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Sertifikat audit kesiapan finansial resmi sebagai <em>compensating factor</em> untuk diajukan ke analis kredit kantor cabang Bank BTN.
          </p>
        </div>

        <button
          onClick={handleDownload}
          className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-btn-orange hover:bg-btn-orange-hover text-white text-sm font-extrabold shadow-lg shadow-btn-orange/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Download className="w-5 h-5" />
          <span>Unduh Rapor Resmi (PDF)</span>
        </button>
      </div>

      {/* Official Certificate Paper Preview */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden text-slate-800">
        {/* Certificate Header Band */}
        <div className="bg-btn-navy px-8 py-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 border-b-4 border-btn-orange">
          <div className="flex items-center space-x-3 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <Building2 className="w-7 h-7 text-btn-orange" />
            </div>
            <div>
              <div className="text-lg font-black tracking-tight">
                PULIH<span className="text-btn-orange">KPR</span>
              </div>
              <div className="text-xs text-blue-200 font-medium">
                Inkubasi Perilaku Finansial & Dokumen Kesiapan Pra-Akad Bank BTN
              </div>
            </div>
          </div>

          <div className="text-center sm:text-right">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold uppercase tracking-wider">
              Lulus Uji 180 Hari
            </span>
            <div className="text-[11px] text-blue-200 mt-1 font-mono">
              Ref: BTN-PLH-{Date.now().toString().slice(-8)}
            </div>
          </div>
        </div>

        {/* Certificate Body */}
        <div className="p-8 sm:p-10 space-y-8">
          {/* Candidate Profile Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 font-bold block mb-0.5">Nama Calon Debitur</span>
              <strong className="text-slate-900 text-sm">{userData.name || 'Nasabah Binaan BTN'}</strong>
            </div>
            <div>
              <span className="text-slate-400 font-bold block mb-0.5">Penghasilan Bersih</span>
              <strong className="text-slate-900 text-sm">{formatRupiah(userData.income)} / bln</strong>
            </div>
            <div>
              <span className="text-slate-400 font-bold block mb-0.5">Target Produk Hunian</span>
              <strong className="text-btn-navy text-sm">{reportPayload.targetKprName}</strong>
            </div>
          </div>

          {/* Transformation Matrix */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-btn-navy">
              Matriks Transformasi Kesiapan Kredit (Before vs After)
            </h3>
            <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs">
              <div className="grid grid-cols-12 bg-slate-100/80 p-3 font-bold text-slate-600">
                <div className="col-span-5">Indikator Penilaian Bank</div>
                <div className="col-span-3 text-center">Status Awal (Gugur)</div>
                <div className="col-span-4 text-right">Status Akhir (Pra-Akad)</div>
              </div>

              <div className="grid grid-cols-12 p-3.5 bg-white items-center">
                <div className="col-span-5 font-semibold text-slate-800">
                  Rasio Beban Utang (DSR)
                </div>
                <div className="col-span-3 text-center text-rose-600 font-bold">
                  {initialDsr}% (Zona Waspada)
                </div>
                <div className="col-span-4 text-right text-emerald-700 font-extrabold flex items-center justify-end space-x-1">
                  <span>0% (Sangat Sehat)</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
              </div>

              <div className="grid grid-cols-12 p-3.5 bg-slate-50/50 items-center">
                <div className="col-span-5 font-semibold text-slate-800">
                  Sisa Pokok Utang Konsumtif
                </div>
                <div className="col-span-3 text-center text-slate-500 font-medium">
                  {formatRupiah(initialPrincipal)}
                </div>
                <div className="col-span-4 text-right text-emerald-700 font-extrabold flex items-center justify-end space-x-1">
                  <span>Lunas (SKL Terbit)</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
              </div>

              <div className="grid grid-cols-12 p-3.5 bg-white items-center">
                <div className="col-span-5 font-semibold text-slate-800">
                  Mutasi Rekening Koran
                </div>
                <div className="col-span-3 text-center text-slate-500 font-medium">
                  Tercemar transaksi labil
                </div>
                <div className="col-span-4 text-right text-emerald-700 font-extrabold flex items-center justify-end space-x-1">
                  <span>180 Hari Bersih</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
              </div>

              <div className="grid grid-cols-12 p-3.5 bg-slate-50/50 items-center">
                <div className="col-span-5 font-semibold text-slate-800">
                  Dana Terkunci di Tabungan BTN
                </div>
                <div className="col-span-3 text-center text-slate-500 font-medium">
                  Rp 0
                </div>
                <div className="col-span-4 text-right text-btn-navy font-black text-sm">
                  {formatRupiah(savings.totalSaved)}
                </div>
              </div>
            </div>
          </div>

          {/* Underwriter Recommendation Box */}
          <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 text-xs text-slate-700 space-y-2 leading-relaxed">
            <div className="font-extrabold text-btn-navy flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-btn-navy" />
              <span>Rekomendasi untuk Analis Kredit Cabang Bank BTN:</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Calon debitur telah menyelesaikan program inkubasi disiplin perbankan selama 180 hari secara mandiri. Telah membuktikan ketahanan arus kas dengan menabung komitmen cicilan rutin di Bank BTN sebesar <strong>{formatRupiah(savings.totalSaved)}</strong>. Rapor ini berfungsi sebagai <strong>Compensating Factor</strong> untuk memperkuat persetujuan kredit pada permohonan KPR yang bersangkutan.
            </p>
          </div>

          {/* Verification Barcode / Footer */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-300">
                <QrCode className="w-7 h-7 text-slate-800" />
              </div>
              <div>
                <span className="font-bold text-slate-800 block">QR Verifikasi Integritas</span>
                <span className="text-[10px]">Tersinkronisasi ekosistem digital BTN Housingpreneur</span>
              </div>
            </div>

            <div className="text-center sm:text-right text-[11px]">
              <span className="font-bold text-slate-700 block">Kompetisi BTN Housingpreneur Batch 3</span>
              <span className="text-slate-400">Kategori: Housing Innovation | Ambyar Tech</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Navigation */}
      <div className="max-w-4xl mx-auto flex items-center justify-between pt-4">
        <button
          onClick={onBack}
          className="py-3 px-5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors flex items-center space-x-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Tabungan</span>
        </button>

        <button
          onClick={handleDownload}
          className="py-3 px-6 rounded-xl bg-btn-navy hover:bg-btn-navy-hover text-white text-xs font-bold shadow-md shadow-btn-navy/20 flex items-center space-x-2 transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak Dokumen Rapor (PDF)</span>
        </button>
      </div>
    </div>
  );
}
