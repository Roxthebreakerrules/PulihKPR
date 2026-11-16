/**
 * PulihKPR — Financial & Credit Risk Logic Engine
 * Standar perhitungan perbankan KPR Bank BTN & Analisis DSR/SLIK OJK
 */

/**
 * Format number to Indonesian Rupiah (IDR)
 * @param {number} amount 
 * @returns {string} e.g. "Rp 1.500.000"
 */
export function formatRupiah(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calculate total monthly installments from active debts
 * @param {Array<{monthlyInstallment: number}>} debts 
 * @returns {number}
 */
export function calculateTotalInstallments(debts = []) {
  return debts.reduce((sum, d) => sum + (Number(d.monthlyInstallment) || 0), 0);
}

/**
 * Calculate total remaining principal across all debts
 * @param {Array<{remainingPrincipal: number}>} debts 
 * @returns {number}
 */
export function calculateTotalPrincipal(debts = []) {
  return debts.reduce((sum, d) => sum + (Number(d.remainingPrincipal) || 0), 0);
}

/**
 * Calculate Debt Service Ratio (DSR)
 * DSR = (Total Monthly Debt Installments / Monthly Net Income) * 100
 * @param {number} income 
 * @param {number} totalMonthlyInstallments 
 * @returns {number} percentage rounded to 1 decimal
 */
export function calculateDSR(income, totalMonthlyInstallments) {
  if (!income || income <= 0) return 0;
  const ratio = (totalMonthlyInstallments / income) * 100;
  return Math.round(ratio * 10) / 10;
}

/**
 * Get DSR Health Category based on standard bank underwriting thresholds
 * @param {number} dsr 
 * @returns {{ level: string, color: string, badge: string, description: string }}
 */
export function getDSRStatus(dsr) {
  if (dsr <= 30) {
    return {
      level: 'SEHAT',
      color: 'emerald',
      badge: 'Sangat Aman (<= 30%)',
      description: 'Porsi utang sangat ideal. Analis bank menyukai profil rasio utang rendah.',
    };
  }
  if (dsr <= 40) {
    return {
      level: 'WASPADA',
      color: 'amber',
      badge: 'Batas Toleransi (31% - 40%)',
      description: 'Mendekati batas maksimal DSR bank. Perlu pengurangan utang sebelum pengajuan KPR.',
    };
  }
  return {
    level: 'BAHAYA',
    color: 'rose',
    badge: 'Zona Tolak Analis (> 40%)',
    description: 'Rasio cicilan terlalu tinggi. Permohonan KPR berisiko besar langsung di-reject analis bank.',
  };
}

/**
 * Calculate Maximum KPR Installment Capacity
 * Standard safe banking ceiling is 35% of monthly income minus existing installments.
 * @param {number} income 
 * @param {number} existingInstallments 
 * @param {number} maxDsrRatio (default 0.35)
 * @returns {{ maxAllowedTotal: number, availableKprInstallment: number, isEligible: boolean }}
 */
export function calculateMaxKprInstallment(income, existingInstallments = 0, maxDsrRatio = 0.35) {
  const maxAllowedTotal = Math.round(income * maxDsrRatio);
  const availableKprInstallment = Math.max(0, maxAllowedTotal - existingInstallments);
  const isEligible = availableKprInstallment >= 1000000; // Minimal cicilan KPR Subsidi ~Rp1jt

  return {
    maxAllowedTotal,
    availableKprInstallment,
    isEligible,
  };
}

/**
 * Estimate Maximum Property Value based on KPR annuity formula
 * PV = PMT * [1 - (1 + r)^(-n)] / r
 * @param {number} monthlyInstallment 
 * @param {number} annualInterestRate (e.g. 0.05 for FLPP 5% fixed)
 * @param {number} tenorYears (default 20)
 * @returns {number} estimated max loan property ceiling
 */
export function estimateMaxKprLoan(monthlyInstallment, annualInterestRate = 0.05, tenorYears = 20) {
  if (!monthlyInstallment || monthlyInstallment <= 0) return 0;
  const r = annualInterestRate / 12;
  const n = tenorYears * 12;
  const pv = monthlyInstallment * (1 - Math.pow(1 + r, -n)) / r;
  return Math.round(pv / 1000000) * 1000000; // Round to nearest million
}

/**
 * Determine Realistic Triage Classification
 * @param {Array<Object>} debts 
 * @param {number} income 
 * @param {number} livingCost 
 * @returns {{
 *   trackId: 'CEPAT' | 'MENENGAH' | 'RESTRUKTURISASI',
 *   title: string,
 *   durationMonths: string,
 *   recommendedKpr: string,
 *   summary: string,
 *   actionPlan: string[],
 *   isHardCase: boolean
 * }}
 */
export function determineTriage(debts = [], income = 0, livingCost = 0) {
  const totalPrincipal = calculateTotalPrincipal(debts);
  const totalInstallments = calculateTotalInstallments(debts);
  const maxKol = debts.reduce((max, d) => Math.max(max, Number(d.kolStatus) || 1), 1);
  const dsr = calculateDSR(income, totalInstallments);
  const monthlySurplus = income - livingCost - totalInstallments;

  // Kasus Berat / Restrukturisasi:
  // Utang > Rp 50 Juta, ATAU memiliki utang Kol 4/5 (Macet/Galbay), ATAU Rasio Utang > 12x gaji
  if (totalPrincipal > 50000000 || maxKol >= 4 || (income > 0 && totalPrincipal / income > 12)) {
    return {
      trackId: 'RESTRUKTURISASI',
      title: 'Jalur Restrukturisasi Khusus',
      durationMonths: '24–36+ Bulan',
      recommendedKpr: 'KPR BTN Bersubsidi (FLPP) Pasca-SKL',
      isHardCase: true,
      summary: 'Total utang atau riwayat galbay melampaui kemampuan bayar bulanan. Sistem menolak target 6 bulan karena tidak realistis tanpa diskon pokok atau likuidasi aset eksternal.',
      actionPlan: [
        'Hentikan gali lubang tutup lubang seketika.',
        'Negosiasi program pelunasan pokok satu kali bayar (lump-sum settlement) dengan penghapusan denda/bunga kepada kreditur resmi.',
        'Wajib mengurus Surat Keterangan Lunas (SKL) resmi dari setiap kreditur.',
        'Tunggu siklus sinkronisasi pelaporan SLIK OJK (30–60 hari) hingga status terbarui.',
        'Baru memulai program 180 hari rekening bersih & tabungan komitmen setelah SKL terbit.'
      ]
    };
  }

  // Kasus Menengah:
  // Utang Rp 15 Juta - Rp 50 Juta, Kol 2-3, atau DSR awal 35-50%
  if (totalPrincipal > 15000000 || maxKol >= 3 || dsr > 40) {
    return {
      trackId: 'MENENGAH',
      title: 'Jalur Menengah (Terstruktur)',
      durationMonths: '12–18 Bulan',
      recommendedKpr: 'KPR BTN Sejahtera FLPP / BTN Platinum',
      isHardCase: false,
      summary: 'Kondisi kredit memerlukan penataan arus kas terencana. Utang dapat diselesaikan secara bertahap sebelum masa pembuktian 6 bulan rekening bersih dimulai.',
      actionPlan: [
        'Terapkan metode Debt Avalanche: prioritaskan pelunasan pinjol berbunga tinggi terlebih dahulu.',
        'Konsolidasikan pengeluaran gaya hidup untuk menambah sisa kas pelunasan pokok.',
        'Setelah utang tuntas, minta surat keterangan bebas tunggakan.',
        'Lakukan program 180 hari pembiasaan menyisihkan cicilan setara KPR di Tabungan BTN.'
      ]
    };
  }

  // Kasus Cepat:
  // Utang < Rp 15 Juta, Kol 1-2, dan sisa kas positif
  return {
    trackId: 'CEPAT',
    title: 'Jalur Cepat (Akselerasi)',
    durationMonths: '3–6 Bulan',
    recommendedKpr: 'KPR BTN Platinum Gaess / KPR Subsidi',
    isHardCase: false,
    summary: 'Profil keuangan relatif sehat. Sedikit tunggakan minor dapat dilunasi cepat dengan sisa kas bulanan, disusul pembuktian mutasi rekening bersih.',
    actionPlan: [
      'Lunasi seluruh saldo paylater/pinjol aktif dalam 1–2 bulan ke depan.',
      'Jaga mutasi rekening bank 100% bebas dari transaksi berisiko atau deposit platform impulsif.',
      'Setor tabungan komitmen sebesar estimasi cicilan KPR (Rp1,5–2,5 jt/bln) ke Tabungan BTN Siap/Batara.',
      'Cetak Rapor Kesiapan Pra-Akad dan ajukan langsung ke kantor cabang BTN.'
    ]
  };
}

/**
 * Simulate Payoff Timeline (Avalanche vs Snowball)
 * @param {Array<Object>} debts 
 * @param {number} extraMonthlyPayment 
 * @param {'avalanche' | 'snowball'} strategy 
 * @returns {{ sortedDebts: Array<Object>, estimatedMonths: number, payoffOrder: string[] }}
 */
export function simulatePayoff(debts = [], extraMonthlyPayment = 500000, strategy = 'avalanche') {
  if (!debts || debts.length === 0) {
    return { sortedDebts: [], estimatedMonths: 0, payoffOrder: [] };
  }

  const cloned = debts.map(d => ({ ...d }));

  if (strategy === 'avalanche') {
    // Sort by interest rate descending (or priority: Pinjol > Paylater > KTA > Lainnya)
    const priorityMap = { 'pinjol_legal': 4, 'paylater': 3, 'cc': 2, 'multiguna': 1 };
    cloned.sort((a, b) => (priorityMap[b.creditorType] || 0) - (priorityMap[a.creditorType] || 0));
  } else {
    // Snowball: Sort by smallest principal balance first
    cloned.sort((a, b) => Number(a.remainingPrincipal) - Number(b.remainingPrincipal));
  }

  const totalPrincipal = calculateTotalPrincipal(cloned);
  const totalBaseInstallment = calculateTotalInstallments(cloned);
  const totalMonthlyPace = totalBaseInstallment + extraMonthlyPayment;

  const estimatedMonths = totalMonthlyPace > 0 
    ? Math.max(1, Math.ceil(totalPrincipal / totalMonthlyPace)) 
    : 99;

  return {
    sortedDebts: cloned,
    estimatedMonths,
    payoffOrder: cloned.map(d => d.creditorName),
  };
}

/**
 * Simulate BTN Commitment Savings Growth (Payment Shock Test)
 * @param {number} monthlyCommitment 
 * @param {number} durationMonths 
 * @param {number} initialDeposit 
 * @returns {{
 *   totalSaved: number,
 *   monthlyBreakdown: Array<{month: number, balance: number, note: string}>,
 *   dpTargetCoveragePercent: number
 * }}
 */
export function simulateBtnSavings(monthlyCommitment = 1500000, durationMonths = 6, initialDeposit = 500000) {
  let currentBalance = initialDeposit;
  const breakdown = [];

  for (let m = 1; m <= durationMonths; m++) {
    currentBalance += monthlyCommitment;
    breakdown.push({
      month: m,
      balance: currentBalance,
      note: m === durationMonths ? 'Lulus Uji Payment Shock — Siap Akad' : `Bulan ke-${m} Disiplin`,
    });
  }

  // Assuming target DP + Biaya Akad standard KPR Subsidi is ~Rp 12.000.000
  const targetCoverage = Math.min(100, Math.round((currentBalance / 12000000) * 100));

  return {
    totalSaved: currentBalance,
    monthlyBreakdown: breakdown,
    dpTargetCoveragePercent: targetCoverage,
  };
}
