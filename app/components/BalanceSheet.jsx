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
    arr.reduce((sum, acc) => sum + Number(acc.balance), 0);

  const formatAmount = (amount) =>
    amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
    });

  const totalAssets = sumBalance(assets);
  const totalLiabilities = sumBalance(liabilities);
  const totalEquity = sumBalance(equity);

  const isBalanced =
    Number(totalAssets.toFixed(2)) ===
    Number((totalLiabilities + totalEquity).toFixed(2));

  return (
    <div className="">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Balance Sheet</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Assets */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Assets</h3>

          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2 border">Account</th>
                <th className="text-right px-4 py-2 border">Balance</th>
              </tr>
            </thead>

            <tbody>
              {assets.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="px-4 py-2 border">{a.name}</td>
                  <td className="px-4 py-2 border text-right">
                    {formatAmount(Number(a.balance))}
                  </td>
                </tr>
              ))}

              <tr className="font-bold bg-gray-50">
                <td className="px-4 py-2 border">Total Assets</td>
                <td className="px-4 py-2 border text-right">
                  {formatAmount(totalAssets)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Liabilities & Equity */}
        <div>
          {/* Liabilities */}
          <h3 className="text-lg font-semibold mb-2 text-gray-700">
            Liabilities
          </h3>

          <table className="w-full border mb-6">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2 border">Account</th>
                <th className="text-right px-4 py-2 border">Balance</th>
              </tr>
            </thead>

            <tbody>
              {liabilities.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="px-4 py-2 border">{a.name}</td>
                  <td className="px-4 py-2 border text-right">
                    {formatAmount(Number(a.balance))}
                  </td>
                </tr>
              ))}

              <tr className="font-bold bg-gray-50">
                <td className="px-4 py-2 border">Total Liabilities</td>
                <td className="px-4 py-2 border text-right">
                  {formatAmount(totalLiabilities)}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Equity */}
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Equity</h3>

          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2 border">Account</th>
                <th className="text-right px-4 py-2 border">Balance</th>
              </tr>
            </thead>

            <tbody>
              {equity.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="px-4 py-2 border">{a.name}</td>
                  <td className="px-4 py-2 border text-right">
                    {formatAmount(Number(a.balance))}
                  </td>
                </tr>
              ))}

              <tr className="font-bold bg-gray-50">
                <td className="px-4 py-2 border">Total Equity</td>
                <td className="px-4 py-2 border text-right">
                  {formatAmount(totalEquity)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Equation Check */}
      <div
        className={`mt-6 p-4 rounded font-semibold ${
          isBalanced ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
        }`}
      >
        Assets ({formatAmount(totalAssets)}) = Liabilities + Equity (
        {formatAmount(totalLiabilities + totalEquity)})
      </div>
    </div>
  );
}
