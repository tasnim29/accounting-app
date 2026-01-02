"use client";

import { useState, useEffect } from "react";

export default function JournalReport() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch("/api/reports/journal")
      .then((res) => res.json())
      .then((data) => setTransactions(data));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Journal Report</h2>

      {transactions.map((tx) => (
        <div key={tx.id} className="mb-6 border p-4 rounded shadow">
          <div className="flex justify-between mb-2">
            <span className="font-semibold">Date: {tx.date}</span>
            <span className="font-semibold">Transaction ID: {tx.id}</span>
          </div>
          <div className="mb-2">
            <span className="font-semibold">Description:</span> {tx.description}
          </div>

          <table className="w-full text-left border-t border-b">
            <thead>
              <tr>
                <th className="py-1">Account</th>
                <th>Type</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {tx.entries.map((entry) => (
                <tr key={entry.id} className="border-b">
                  <td className="py-1">{entry.account_name}</td>
                  <td>{entry.type}</td>
                  <td>{entry.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
