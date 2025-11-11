import React from 'react';
import Calculator from './components/Calculator.jsx';
import './styles.css';

export default function App() {
  return (
    <div className="container">
      <header className="header" role="banner">
        <div>
          <h1>Mortgage Calculator</h1>
          <p>Estimate your monthly repayments quickly and clearly.</p>
        </div>
      </header>

      <main role="main">
        <Calculator />
      </main>
    </div>
  );
}

