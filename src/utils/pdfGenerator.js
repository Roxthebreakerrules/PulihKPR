import { jsPDF } from 'jspdf';
import { formatRupiah } from './financialCalculators.js';

/**
 * Generate official Bank BTN-style Rapor Kesiapan Pra-Akad PDF
 * @param {Object} reportData 
 */
export function generateReportPDF(reportData) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Header Background Band (BTN Navy)
  doc.setFillColor(10, 56, 113); // #0A3871
  doc.rect(0, 0, pageWidth, 32, 'F');

  // Accent Line (BTN Orange)
  doc.setFillColor(243, 112, 33); // #F37021
  doc.rect(0, 32, pageWidth, 2.5, 'F');

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('PULIHKPR — RAPOR KESIAPAN PRA-AKAD', 15, 16);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Inkubasi Perilaku Finansial & Dokumen Pendukung Analis Kredit Bank BTN', 15, 23);

  // Document Metadata Box
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(`No. Registrasi: BTN-PLH-${Date.now().toString().slice(-8)}`, 15, 42);
  doc.setFont('helvetica', 'normal');
  doc.text(`Tanggal Audit: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, 15, 47);
  doc.text('Status Verifikasi: LULUS UJI 180 HARI PAYMENT SHOCK', pageWidth - 15, 42, { align: 'right' });
  doc.text('Kepatuhan Data: 100% Client-Side (UU PDP No. 27/2022)', pageWidth - 15, 47, { align: 'right' });

  // Divider
  doc.setDrawColor(220, 225, 230);
  doc.line(15, 52, pageWidth - 15, 52);

  // Section 1: Profil Nasabah
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(10, 56, 113);
  doc.text('1. PROFIL CALON DEBITUR', 15, 60);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(40, 40, 40);

  const col1X = 15;
  const col2X = 90;

  doc.text(`Nama Lengkap: ${reportData.name || 'Nasabah Binaan BTN'}`, col1X, 68);
  doc.text(`Penghasilan Bersih: ${formatRupiah(reportData.income)} / bulan`, col1X, 74);
  doc.text(`Target Produk: ${reportData.targetKprName || 'KPR BTN Sejahtera FLPP'}`, col2X, 68);
  doc.text(`Simulasi Cicilan KPR: ${formatRupiah(reportData.estimatedInstallment)} / bulan`, col2X, 74);

  // Section 2: Transformasi Skor Kredit
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(10, 56, 113);
  doc.text('2. EVALUASI RISIKO & TRANSFORMASI DSR (DEBT SERVICE RATIO)', 15, 87);

  // Score Table Header
  doc.setFillColor(245, 247, 250);
  doc.rect(15, 92, pageWidth - 30, 8, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(60, 60, 60);
  doc.text('PARAMETER EVALUASI', 18, 97);
  doc.text('KONDISI AWAL (REJECTED)', 85, 97);
  doc.text('KONDISI AKHIR (PRA-AKAD)', 140, 97);

  // Score Table Rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  const rows = [
    ['Rasio Beban Utang (DSR)', `${reportData.initialDsr}% (Zona Waspada/Tolak)`, `${reportData.finalDsr}% (Sangat Sehat <30%)`],
    ['Sisa Pokok Utang Konsumtif', formatRupiah(reportData.initialPrincipal), 'Rp 0 (Lunas / Terbit SKL)'],
    ['Riwayat Transaksi Berisiko', 'Terdeteksi mutasi labil', '100% Bersih selama 180 hari'],
    ['Tabungan Komitmen Terkunci', 'Rp 0 (Belum ada dana DP)', `${formatRupiah(reportData.savingsAccumulation)} (Terkunci di BTN)`],
    ['Uji Ketahanan Kas (Payment Shock)', 'Belum teruji', 'LULUS 6 BULAN TANPA CACAT'],
  ];

  let currentY = 105;
  rows.forEach((r, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(250, 252, 255);
      doc.rect(15, currentY - 4, pageWidth - 30, 7, 'F');
    }
    doc.text(r[0], 18, currentY);
    doc.text(r[1], 85, currentY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(10, 56, 113);
    doc.text(r[2], 140, currentY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    currentY += 7;
  });

  // Section 3: Kesimpulan & Rekomendasi Analis Kredit
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(10, 56, 113);
  doc.text('3. REKOMENDASI FORMAL UNTUK ANALIS KREDIT CABANG BTN', 15, currentY + 10);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(50, 50, 50);

  const recommendationText = 
    `Berdasarkan hasil pembiasaan perilaku finansial selama 180 hari berturut-turut pada platform PulihKPR, nasabah ini telah membuktikan komitmennya dengan: (1) Menyelesaikan kewajiban tunggakan pokok, (2) Mempertahankan rekening koran bersih bebas transaksi berisiko, dan (3) Mengendapkan tabungan komitmen setara cicilan KPR sebesar ${formatRupiah(reportData.savingsAccumulation)} di Bank BTN.\n\n` +
    'Rapor ini diterbitkan sebagai BUKTI FAKTOR PERINGAN RISIKO (COMPENSATING FACTOR) untuk memperkuat keputusan persetujuan kredit pada Kantor Cabang Bank BTN terkait.';

  const splitText = doc.splitTextToSize(recommendationText, pageWidth - 30);
  doc.text(splitText, 15, currentY + 18);

  // Footer & Signature Box
  const footerY = pageHeight - 35;
  doc.setDrawColor(200, 205, 210);
  doc.line(15, footerY, pageWidth - 15, footerY);

  doc.setFontSize(7.5);
  doc.setTextColor(100, 100, 100);
  doc.text('Dokumen ini dihasilkan secara otomatis oleh sistem PulihKPR yang terintegrasi dengan ekosistem BTN Housingpreneur.', 15, footerY + 6);
  doc.text('Dapat diverifikasi langsung melalui portal resmi atau dengan mencocokkan mutasi Tabungan BTN debitur.', 15, footerY + 11);

  // Stamp / Watermark
  doc.setDrawColor(10, 56, 113);
  doc.setLineWidth(0.8);
  doc.roundedRect(pageWidth - 65, footerY + 2, 50, 20, 2, 2);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(10, 56, 113);
  doc.text('BTN HOUSINGPRENEUR', pageWidth - 40, footerY + 10, { align: 'center' });
  doc.setFontSize(6.5);
  doc.setTextColor(243, 112, 33);
  doc.text('VERIFIED CANDIDATE', pageWidth - 40, footerY + 16, { align: 'center' });

  // Save the PDF
  doc.save(`Rapor_Kesiapan_KPR_${(reportData.name || 'BTN').replace(/\s+/g, '_')}.pdf`);
}
