"use client";

import { useEffect, useState } from "react";

export default function JournalReport() {
  const [transactions, setTransactions] = useState([]);

  const handleDelete = async (id) => {
    const confirmed = confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (!confirmed) return;

    const res = await fetch(`/api/transactions/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    } else {
      alert("Failed to delete transaction");
    }
  };

  useEffect(() => {
    fetch("/api/reports/journal")
      .then((res) => res.json())
      .then((data) => setTransactions(data));
  }, []);

  return (
    <div className="">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">General Journal</h2>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-left">Date</th>
              <th className="border px-3 py-2 text-left">Description</th>
              <th className="border px-3 py-2 text-left">Account</th>
              <th className="border px-3 py-2 text-right">Debit</th>
              <th className="border px-3 py-2 text-right">Credit</th>
              <th className="border px-3 py-2 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((tx) =>
              tx.entries.map((entry, index) => (
                <tr key={entry.id} className="border-t">
                  {/* Date */}
                  <td className="border px-3 py-2">
                    {index === 0 ? tx.date : ""}
                  </td>

                  {/* Description */}
                  <td className="border px-3 py-2">
                    {index === 0 ? tx.description : ""}
                  </td>

                  {/* Account */}
                  <td
                    className={`border px-3 py-2 ${
                      entry.type === "credit" ? "pl-8" : ""
                    }`}
                  >
                    {entry.account_name}
                  </td>

                  {/* Debit */}
                  <td className="border px-3 py-2 text-right">
                    {entry.type === "debit" ? entry.amount.toFixed(2) : ""}
                  </td>

                  {/* Credit */}
                  <td className="border px-3 py-2 text-right">
                    {entry.type === "credit" ? entry.amount.toFixed(2) : ""}
                  </td>
                  {/* delete */}
                  <td className="border px-3 py-2">
                    {index === 0 && (
                      <button
                        onClick={() => handleDelete(tx.id)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
