"use client";

import { useEffect, useState } from "react";

export default function BalanceSheet() {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    fetch("/api/reports/balance-sheet")
      .then((res) => res.json())
      .then((data) => setAccounts(data));
  }, []);

  const assets = accounts.filter((a) => a.type === "Asset");
  const liabilities = accounts.filter((a) => a.type === "Liability");
  const equity = accounts.filter((a) => a.type === "Equity");

  const sumBalance = (arr) =>
    arr.reduce((sum, acc) => sum + parseFloat(acc.balance), 0).toFixed(2);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Balance Sheet</h2>

      <div className="mb-6">
        <h3 className="font-semibold">Assets</h3>
        <table className="w-full border-t border-b mb-2">
          <tbody>
            {assets.map((a) => (
              <tr key={a.id} className="border-b">
                <td>{a.name}</td>
                <td>{a.balance}</td>
              </tr>
            ))}
            <tr className="font-bold">
              <td>Total Assets</td>
              <td>{sumBalance(assets)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold">Liabilities</h3>
        <table className="w-full border-t border-b mb-2">
          <tbody>
            {liabilities.map((a) => (
              <tr key={a.id} className="border-b">
                <td>{a.name}</td>
                <td>{a.balance}</td>
              </tr>
            ))}
            <tr className="font-bold">
              <td>Total Liabilities</td>
              <td>{sumBalance(liabilities)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold">Equity</h3>
        <table className="w-full border-t border-b mb-2">
          <tbody>
            {equity.map((a) => (
              <tr key={a.id} className="border-b">
                <td>{a.name}</td>
                <td>{a.balance}</td>
              </tr>
            ))}
            <tr className="font-bold">
              <td>Total Equity</td>
              <td>{sumBalance(equity)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="font-bold text-lg mt-4">
        Total Assets = {sumBalance(assets)} | Total Liabilities + Equity ={" "}
        {(
          parseFloat(sumBalance(liabilities)) + parseFloat(sumBalance(equity))
        ).toFixed(2)}
      </div>
    </div>
  );
}
