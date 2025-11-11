export function toNumber(val) {
  const n = typeof val === 'string' ? Number(val.replace(/[, ]/g, '')) : Number(val);
  return Number.isFinite(n) ? n : 0;
}

export function formatGBP(n) {
  if (!Number.isFinite(n)) return '£0';
  return n.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 2 });
}

// Repayment mortgage: M = P * [ r(1+r)^n / ((1+r)^n − 1) ]
export function repaymentMonthly(P, annualRatePct, years) {
  const r = (annualRatePct / 100) / 12;
  const n = Math.round(years * 12);
  if (n <= 0) return 0;
  if (r === 0) return P / n;
  return P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

// Interest-only monthly = P * (APR/12)
export function interestOnlyMonthly(P, annualRatePct) {
  const r = (annualRatePct / 100) / 12;
  return P * r;
}

export function totalsForRepayment(P, annualRatePct, years, fees = 0) {
  const m = repaymentMonthly(P, annualRatePct, years);
  const n = Math.round(years * 12);
  const total = (m * n) + fees;
  const interest = total - P - fees;
  return { monthly: m, total, interest };
}

export function totalsForInterestOnly(P, annualRatePct, years, fees = 0) {
  const m = interestOnlyMonthly(P, annualRatePct);
  const n = Math.round(years * 12);
  const interest = (m * n);
  const total = P + interest + fees; // principal repaid at end
  return { monthly: m, total, interest };
}
