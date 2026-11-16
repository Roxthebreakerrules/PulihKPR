import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatRupiah,
  calculateTotalInstallments,
  calculateTotalPrincipal,
  calculateDSR,
  getDSRStatus,
  calculateMaxKprInstallment,
  estimateMaxKprLoan,
  determineTriage,
  simulatePayoff,
  simulateBtnSavings
} from './financialCalculators.js';

test('formatRupiah formats correctly', () => {
  const result = formatRupiah(1500000);
  assert.ok(result.includes('1.500.000'));
});

test('calculateDSR calculates percentage accurately', () => {
  const income = 5000000;
  const installments = 2000000;
  const dsr = calculateDSR(income, installments);
  assert.equal(dsr, 40.0);
});

test('getDSRStatus returns correct tiering', () => {
  assert.equal(getDSRStatus(25).level, 'SEHAT');
  assert.equal(getDSRStatus(35).level, 'WASPADA');
  assert.equal(getDSRStatus(48).level, 'BAHAYA');
});

test('calculateMaxKprInstallment calculates available headroom', () => {
  const income = 6000000;
  const existingDebts = 1000000;
  // 35% of 6jt = 2.1jt. Available = 2.1jt - 1jt = 1.1jt
  const result = calculateMaxKprInstallment(income, existingDebts, 0.35);
  assert.equal(result.maxAllowedTotal, 2100000);
  assert.equal(result.availableKprInstallment, 1100000);
  assert.equal(result.isEligible, true);
});

test('determineTriage classifies Hard Case correctly (Mas Hendra: Gaji 4jt, Utang 100jt, Kol 5)', () => {
  const debts = [
    { creditorName: 'Pinjol A', creditorType: 'pinjol_legal', remainingPrincipal: 30000000, monthlyInstallment: 2500000, kolStatus: 2 },
    { creditorName: 'Pinjol B (Galbay)', creditorType: 'pinjol_legal', remainingPrincipal: 70000000, monthlyInstallment: 0, kolStatus: 5 }
  ];
  const triage = determineTriage(debts, 4000000, 2500000);
  assert.equal(triage.trackId, 'RESTRUKTURISASI');
  assert.equal(triage.isHardCase, true);
  assert.ok(triage.summary.includes('menolak target 6 bulan'));
});

test('determineTriage classifies Quick Case correctly (Mas Rian: Gaji 5.5jt, Utang 8.5jt, Kol 2)', () => {
  const debts = [
    { creditorName: 'Paylater Travel', creditorType: 'paylater', remainingPrincipal: 4500000, monthlyInstallment: 800000, kolStatus: 1 },
    { creditorName: 'Paylater E-Comm', creditorType: 'paylater', remainingPrincipal: 4000000, monthlyInstallment: 750000, kolStatus: 2 }
  ];
  const triage = determineTriage(debts, 5500000, 2500000);
  assert.equal(triage.trackId, 'CEPAT');
  assert.equal(triage.isHardCase, false);
});

test('simulatePayoff sorts debts appropriately', () => {
  const debts = [
    { creditorName: 'KTA', creditorType: 'multiguna', remainingPrincipal: 10000000, monthlyInstallment: 500000 },
    { creditorName: 'Pinjol Cepat', creditorType: 'pinjol_legal', remainingPrincipal: 3000000, monthlyInstallment: 400000 }
  ];
  // Snowball sorts smallest principal first
  const snowball = simulatePayoff(debts, 500000, 'snowball');
  assert.equal(snowball.sortedDebts[0].creditorName, 'Pinjol Cepat');

  // Avalanche sorts by priority: pinjol > multiguna
  const avalanche = simulatePayoff(debts, 500000, 'avalanche');
  assert.equal(avalanche.sortedDebts[0].creditorName, 'Pinjol Cepat');
});

test('simulateBtnSavings generates 6-month breakdown and total accumulation', () => {
  const result = simulateBtnSavings(1500000, 6, 500000);
  // Initial 500rb + (6 * 1.5jt) = 9.5jt
  assert.equal(result.totalSaved, 9500000);
  assert.equal(result.monthlyBreakdown.length, 6);
  assert.equal(result.monthlyBreakdown[5].balance, 9500000);
});
