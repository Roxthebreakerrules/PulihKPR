/**
 * PulihKPR — Preset Personas Kasus Nyata
 * Digunakan untuk pengujian 1-klik oleh Dewan Juri BTN Housingpreneur
 */

export const PERSONAS = [
  {
    id: 'rian',
    name: 'Mas Rian (27 th)',
    role: 'Desainer Grafis Freelance',
    avatar: '👨‍💻',
    tagline: 'Jalur Cepat (3–6 Bulan) — Utang Ringan & Kol 2',
    income: 5500000,
    livingCost: 2500000,
    targetKprType: 'flpp', // KPR Subsidi FLPP
    targetPropertyPrice: 185000000,
    estimatedKprInstallment: 1150000,
    debts: [
      {
        id: 'debt-1',
        creditorName: 'Paylater Traveloka',
        creditorType: 'paylater',
        remainingPrincipal: 4500000,
        monthlyInstallment: 800000,
        kolStatus: 1,
        interestRateEstimate: '2.5% / bln',
        notes: 'Cicilan tiket kerja freelance luar kota, pembayaran lancar.'
      },
      {
        id: 'debt-2',
        creditorName: 'Paylater E-Commerce',
        creditorType: 'paylater',
        remainingPrincipal: 4000000,
        monthlyInstallment: 750000,
        kolStatus: 2,
        interestRateEstimate: '2.95% / bln',
        notes: 'Pernah telat 15 hari karena keterlambatan termin klien.'
      }
    ],
    riskyTransactions: {
      hasJudolHistory: false,
      hasImpulsiveTopups: true,
      hasMultiplePaylaterLate: false,
    },
    narrative: 'Memiliki riwayat Kol 2 karena keterlambatan bayar 15 hari. Sisa kas bulanan Rp1,45 jt sangat cukup untuk mempercepat pelunasan total Rp8,5 jt dalam 3–4 bulan, disusul 90 hari mutasi rekening bersih untuk mengajukan KPR Subsidi.'
  },
  {
    id: 'sarah',
    name: 'Mbak Sarah (24 th)',
    role: 'First-Jobber BUMN',
    avatar: '👩‍💼',
    tagline: 'Jalur Preventif (3 Bulan) — Rekening Bocor Halus',
    income: 7000000,
    livingCost: 3500000,
    targetKprType: 'platinum', // KPR BTN Platinum Gaess
    targetPropertyPrice: 380000000,
    estimatedKprInstallment: 2400000,
    debts: [
      {
        id: 'debt-3',
        creditorName: 'Kartu Kredit Lifestyle',
        creditorType: 'cc',
        remainingPrincipal: 4000000,
        monthlyInstallment: 600000,
        kolStatus: 1,
        interestRateEstimate: '1.75% / bln',
        notes: 'Cicilan gadget & belanja online, selalu bayar tepat waktu.'
      }
    ],
    riskyTransactions: {
      hasJudolHistory: false,
      hasImpulsiveTopups: false,
      hasMultiplePaylaterLate: false,
    },
    narrative: 'Penghasilan memadai dan SLIK Kol 1 bersih, namun tidak memiliki tabungan mengendap karena kebiasaan transaksi harian yang konsumtif. Membutuhkan program Tabungan Terkunci BTN selama 3–6 bulan untuk membuktikan kesiapan DP dan uji cicilan.'
  },
  {
    id: 'hendra',
    name: 'Mas Hendra (33 th)',
    role: 'Staf Logistik Gudang',
    avatar: '👷‍♂️',
    tagline: 'Jalur Restrukturisasi — Studi Kasus Kritis (Gaji 4jt vs Utang 100jt)',
    income: 4000000,
    livingCost: 2500000,
    targetKprType: 'flpp',
    targetPropertyPrice: 185000000,
    estimatedKprInstallment: 1150000,
    debts: [
      {
        id: 'debt-4',
        creditorName: 'Pinjol Multiguna A (Aktif Cicil)',
        creditorType: 'pinjol_legal',
        remainingPrincipal: 30000000,
        monthlyInstallment: 2500000,
        kolStatus: 2,
        interestRateEstimate: '0.3% / hari',
        notes: 'Gali lubang tutup lubang untuk menutup utang lain.'
      },
      {
        id: 'debt-5',
        creditorName: 'Pinjol B & C (Gagal Bayar Macet)',
        creditorType: 'pinjol_legal',
        remainingPrincipal: 70000000,
        monthlyInstallment: 0,
        kolStatus: 5,
        interestRateEstimate: 'Macet (Bunga Berhenti)',
        notes: 'Status Kol 5 SLIK OJK permanen hingga terbit Surat Keterangan Lunas (SKL).'
      }
    ],
    riskyTransactions: {
      hasJudolHistory: true,
      hasImpulsiveTopups: true,
      hasMultiplePaylaterLate: true,
    },
    narrative: 'Studi kasus nyata yang menguji integritas perbankan: Dengan gaji Rp4 jt dan utang Rp100 jt, mustahil lunas dalam 6 bulan. Sistem secara tegas menolak target instan dan mengarahkan ke restrukturisasi negosiasi pokok/SKL sebelum membuka hak simulasi KPR.'
  }
];
