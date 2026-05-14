// src/pages/Fees.jsx
import React, { useState } from 'react';

const Fees = () => {

  const [feeSummary, setFeeSummary] = useState({
    totalFees: 125000,
    paid: 85000,
    due: 40000,
    dueDate: "30/06/2026"
  });

  const feeStructure = [
    { particular: "Tuition Fee", amount: 90000 },
    { particular: "Development Fee", amount: 15000 },
    { particular: "Library Fee", amount: 5000 },
    { particular: "Examination Fee", amount: 5000 },
    { particular: "Miscellaneous", amount: 10000 },
  ];

  const [paymentHistory, setPaymentHistory] = useState([
    { date: "15/01/2026", amount: 50000, mode: "Online (Net Banking)", refNo: "TXN9876543210", status: "Success" },
    { date: "20/03/2026", amount: 35000, mode: "Credit Card", refNo: "TXN1234567890", status: "Success" },
  ]);

  const [paymentAmount, setPaymentAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = (e) => {
    e.preventDefault();
    const amount = parseFloat(paymentAmount);
    
    if (!amount || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    
    if (amount > feeSummary.due) {
      alert("Amount cannot exceed the pending due.");
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate API call for payment processing
    setTimeout(() => {
      const newPayment = {
        date: new Date().toLocaleDateString('en-GB'),
        amount: amount,
        mode: "Online (Simulated)",
        refNo: "TXN" + Math.floor(1000000000 + Math.random() * 9000000000),
        status: "Success"
      };

      setPaymentHistory(prev => [newPayment, ...prev]);
      
      setFeeSummary(prev => ({
        ...prev,
        paid: prev.paid + amount,
        due: prev.due - amount
      }));

      setIsProcessing(false);
      setPaymentAmount('');
      alert(`Payment of ₹${amount.toLocaleString()} successful!`);
    }, 2000); // 2 second delay to simulate network request
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title gradient-text">Fee Structure & Payments</h1>
        <p className="page-subtitle">Manage your college fee details</p>
      </div>

      <div className="dashboard-grid mb-6">
        <div className="glass-card stat-card">
          <div className="stat-label">Total Fees (Annual)</div>
          <div className="stat-value text-primary" style={{color: 'var(--primary)'}}>₹{feeSummary.totalFees.toLocaleString()}</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-label">Amount Paid</div>
          <div className="stat-value text-success" style={{color: 'var(--success)'}}>₹{feeSummary.paid.toLocaleString()}</div>
        </div>
        <div className="glass-card stat-card" style={{ border: feeSummary.due > 0 ? '1px solid var(--danger)' : '1px solid var(--success)' }}>
          <div className="stat-label">Pending Due</div>
          <div className={`stat-value ${feeSummary.due > 0 ? 'text-danger' : 'text-success'}`} style={{color: feeSummary.due > 0 ? 'var(--danger)' : 'var(--success)'}}>
            ₹{feeSummary.due.toLocaleString()}
          </div>
          {feeSummary.due > 0 ? (
            <div className="text-sm mt-1 text-muted">Due by: {feeSummary.dueDate}</div>
          ) : (
            <div className="text-sm mt-1 text-muted">All dues cleared</div>
          )}
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap' }}>
        
        <div className="glass-card" style={{flex: '1 1 400px'}}>
          <h2 className="text-xl mb-4">Fee Breakdown</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Particulars</th>
                  <th style={{textAlign: 'right'}}>Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {feeStructure.map((item, index) => (
                  <tr key={index}>
                    <td>{item.particular}</td>
                    <td style={{textAlign: 'right'}}>{item.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{fontWeight: 'bold', backgroundColor: 'rgba(255,255,255,0.05)'}}>
                  <td>Total</td>
                  <td style={{textAlign: 'right'}}>{feeSummary.totalFees.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="glass-card" style={{flex: '1 1 400px'}}>
          <div className="flex justify-between items-center mb-4" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h2 className="text-xl">Payment History</h2>
          </div>
          
          {feeSummary.due > 0 && (
            <div className="payment-form-container">
              <h3 className="text-md">Make a Payment</h3>
              <form onSubmit={handlePayment} className="payment-input-group">
                <input 
                  type="number" 
                  placeholder="Enter amount to pay" 
                  className="payment-input"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  max={feeSummary.due}
                  min="1"
                  required
                />
                <button 
                  type="submit"
                  className="btn btn-primary" 
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Pay Now'}
                </button>
              </form>
              <p className="text-xs text-muted mt-2">Remaining due: ₹{feeSummary.due.toLocaleString()}</p>
            </div>
          )}

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount (₹)</th>
                  <th>Mode</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((payment, index) => (
                  <tr key={index}>
                    <td>{payment.date}</td>
                    <td>{payment.amount.toLocaleString()}</td>
                    <td>{payment.mode}</td>
                    <td>
                        <span className={`status-badge status-present`}>{payment.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};


export default Fees;
