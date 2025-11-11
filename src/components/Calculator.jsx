import React, { useMemo, useState } from 'react';
import Field from './Field.jsx';
import { toNumber, formatGBP, totalsForRepayment, totalsForInterestOnly } from '../utils/math.js';

export default function Calculator() {
  const [price, setPrice] = useState('300000');
  const [depositMode, setDepositMode] = useState('amount'); // 'amount' | 'percent'
  const [deposit, setDeposit] = useState('60000');          // amount or percent
  const [term, setTerm] = useState('25');
  const [rate, setRate] = useState('4.5');
  const [type, setType] = useState('repayment');            // 'repayment' | 'interest-only'
  const [fees, setFees] = useState('0');

  const errors = {};
  const priceN = toNumber(price);
  const termN = toNumber(term);
  const rateN = toNumber(rate);
  const feesN = toNumber(fees);

  let depositN = toNumber(deposit);
  if (depositMode === 'percent') depositN = Math.min(priceN * (toNumber(deposit) / 100), priceN);

  if (priceN <= 0) errors.price = 'Enter a valid property price.';
  if (termN <= 0) errors.term = 'Enter a valid term in years.';
  if (rateN < 0) errors.rate = 'Enter a valid interest rate.';
  if (depositN < 0) errors.deposit = 'Deposit cannot be negative.';
  if (depositN >= priceN && priceN > 0) errors.deposit = 'Deposit must be less than price.';

  const loan = Math.max(priceN - depositN, 0);

  const results = useMemo(() => {
    if (Object.keys(errors).length > 0 || loan <= 0) return null;
    return type === 'repayment'
      ? totalsForRepayment(loan, rateN, termN, feesN)
      : totalsForInterestOnly(loan, rateN, termN, feesN);
  }, [errors, loan, rateN, termN, feesN, type]);

  return (
    <div className="grid">
      <div className="card" aria-labelledby="calc-title">
        <h2 id="calc-title" style={{ marginTop: 0 }}>Enter your details</h2>

        <Field id="price" label="Property price" hint="£" error={errors.price}>
          <input id="price" inputMode="decimal" type="number" min="0" value={price} onChange={e => setPrice(e.target.value)} />
        </Field>

        <div className="inline">
          <div>
            <div className="label-line" style={{ marginBottom: 8 }}>
              <label>Deposit</label>
              <div className="toggle" role="group" aria-label="Deposit mode">
                <button type="button" aria-pressed={depositMode === 'amount'} onClick={() => setDepositMode('amount')}>£</button>
                <button type="button" aria-pressed={depositMode === 'percent'} onClick={() => setDepositMode('percent')}>%</button>
              </div>
            </div>
            <input
              id="deposit"
              inputMode="decimal"
              type="number"
              min="0"
              value={deposit}
              onChange={e => setDeposit(e.target.value)}
              aria-describedby="deposit-hint"
            />
            <div id="deposit-hint" className="hint">
              {depositMode === 'amount' ? 'Enter deposit in pounds' : 'Enter deposit as a percent of price'}
            </div>
            {errors.deposit && <div className="error" role="alert">{errors.deposit}</div>}
          </div>

          <Field id="term" label="Term" hint="years" error={errors.term}>
            <input id="term" inputMode="numeric" type="number" min="1" value={term} onChange={e => setTerm(e.target.value)} />
          </Field>
        </div>

        <div className="inline">
          <Field id="rate" label="Interest rate (APR)" hint="% per year" error={errors.rate}>
            <input id="rate" inputMode="decimal" type="number" min="0" step="0.01" value={rate} onChange={e => setRate(e.target.value)} />
          </Field>

          <Field id="fees" label="Fees (optional)" hint="£ upfront">
            <input id="fees" inputMode="decimal" type="number" min="0" value={fees} onChange={e => setFees(e.target.value)} />
          </Field>
        </div>

        <Field id="type" label="Repayment type">
          <select id="type" value={type} onChange={e => setType(e.target.value)}>
            <option value="repayment">Repayment</option>
            <option value="interest-only">Interest-only</option>
          </select>
        </Field>

        <button className="primary" onClick={() => { /* live calculation already happens */ }}>
          Calculate
        </button>

        <div className="footer-note">
          We don’t store your inputs. Figures are illustrative and not financial advice.
        </div>
      </div>

      <div className="card" aria-live="polite" aria-atomic="true">
        <h2 style={{ marginTop: 0 }}>Results</h2>

        <div className="form-row">
          <div className="label-line">
            <span>Loan amount</span>
            <strong>{formatGBP(loan)}</strong>
          </div>
        </div>

        {results ? (
          <>
            <div className="kpi">
              <div className="item">
                <span>Estimated monthly payment</span>
                <span className="value">{formatGBP(results.monthly)}</span>
              </div>
              <div className="item">
                <span>Total to repay</span>
                <span className="value">{formatGBP(results.total)}</span>
              </div>
              <div className="item">
                <span>Total interest</span>
                <span className="value">{formatGBP(results.interest)}</span>
              </div>
            </div>

            <details style={{ marginTop: 12 }}>
              <summary>How we calculate this</summary>
              <p style={{ color: 'var(--muted)', lineHeight: 1.5 }}>
                For <strong>repayment</strong> mortgages, we use the standard amortizing loan formula.
                If the rate is 0%, it’s simply principal divided by months. For <strong>interest-only</strong>,
                monthly interest is principal × (APR/12) and principal is typically repaid at term end.
              </p>
            </details>

            <button
              style={{ marginTop: 12 }}
              className="primary"
              onClick={() => {
                window.alert(
`Copy these for feedback:
- Are the labels clear?
- Did you understand "repayment" vs "interest-only"?
- What was confusing?
- What would you add or remove?
- Do the numbers match your expectations?`
                );
              }}
            >
              Share feedback
            </button>
          </>
        ) : (
          <p className="hint">Enter valid details to see your results.</p>
        )}

        <div className="footer-note">
          Assumes fixed rate for the term you entered and equal monthly payments.
        </div>
      </div>
    </div>
  );
}
