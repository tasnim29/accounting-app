"use client";

import { useEffect, useState } from "react";

export default function IncomeStatement() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/reports/income-statement")
      .then((res) => res.json())
      .then((d) => setData(d));
  }, []);

  if (!data) return <div className="p-4 text-gray-500">Loading...</div>;

  const revenueAccounts = data.accounts.filter((a) => a.type === "Revenue");
  const expenseAccounts = data.accounts.filter((a) => a.type === "Expense");

  const formatAmount = (amount) =>
    Number(amount).toLocaleString(undefined, {
      minimumFractionDigits: 2,
    });

  return (
    <div className="">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Income Statement (Profit & Loss)
      </h2>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Revenue</h3>

        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2 border">Account</th>
              <th className="text-right px-4 py-2 border">Amount</th>
            </tr>
          </thead>

          <tbody>
            {revenueAccounts.map((a) => (
              <tr key={a.id} className="border-t">
                <td className="px-4 py-2 border">{a.name}</td>
                <td className="px-4 py-2 border text-right">
                  {formatAmount(a.amount)}
                </td>
              </tr>
            ))}

            <tr className="font-bold bg-gray-50">
              <td className="px-4 py-2 border">Total Revenue</td>
              <td className="px-4 py-2 border text-right">
                {formatAmount(data.totalRevenue)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Expenses</h3>

        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2 border">Account</th>
              <th className="text-right px-4 py-2 border">Amount</th>
            </tr>
          </thead>

          <tbody>
            {expenseAccounts.map((a) => (
              <tr key={a.id} className="border-t">
                <td className="px-4 py-2 border">{a.name}</td>
                <td className="px-4 py-2 border text-right">
                  {formatAmount(a.amount)}
                </td>
              </tr>
            ))}

            <tr className="font-bold bg-gray-50">
              <td className="px-4 py-2 border">Total Expenses</td>
              <td className="px-4 py-2 border text-right">
                {formatAmount(data.totalExpenses)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        className={`text-xl font-bold p-4 rounded ${
          data.netProfit >= 0
            ? "bg-green-50 text-green-700"
            : "bg-red-50 text-red-700"
        }`}
      >
        Net Profit: {formatAmount(data.netProfit)}
      </div>
    </div>
  );
}
