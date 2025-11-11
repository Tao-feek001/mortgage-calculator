import React from 'react';

export default function Field({ id, label, hint, error, children }) {
  return (
    <div className="form-row">
      <div className="label-line">
        <label htmlFor={id}>{label}</label>
        {hint && <span className="hint">{hint}</span>}
      </div>
      {children}
      {error && <div className="error" role="alert">{error}</div>}
    </div>
  );
}
