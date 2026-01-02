"use client";

import Lottie from "lottie-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";

export default function TransactionForm() {
  const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
  const [accounts, setAccounts] = useState([]);
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [entries, setEntries] = useState([
    { account_id: "", type: "debit", amount: "" },
  ]);

  // Fetch accounts
  useEffect(() => {
    fetch("/api/accounts")
      .then((res) => res.json())
      .then((data) => setAccounts(data));
  }, []);

  const addEntry = () => {
    setEntries([...entries, { account_id: "", type: "debit", amount: "" }]);
  };

  const removeEntry = (index) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const handleEntryChange = (index, field, value) => {
    const newEntries = [...entries];
    newEntries[index][field] = value;
    setEntries(newEntries);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const totalDebit = entries
      .filter((e) => e.type === "debit")
      .reduce((sum, e) => sum + Number(e.amount || 0), 0);

    const totalCredit = entries
      .filter((e) => e.type === "credit")
      .reduce((sum, e) => sum + Number(e.amount || 0), 0);

    if (totalDebit !== totalCredit) {
      toast.error("Debits and Credits must be equal");
      return;
    }

    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, description, entries }),
    });

    if (res.ok) {
      toast.success("Transaction saved successfully!");
      setDate("");
      setDescription("");
      setEntries([{ account_id: "", type: "debit", amount: "" }]);
    } else {
      toast.error("Failed to save transaction");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-xl p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Form */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Add Transaction
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Date */}
            <div>
              <label className="block text-sm font-semibold mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-green-600 rounded-lg p-2 focus:ring focus:ring-green-800"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-green-600 rounded-lg p-2 focus:ring focus:ring-blue-200"
                placeholder="e.g. Cash received from client"
                required
              />
            </div>

            {/* Entries */}
            <div>
              <h3 className="font-semibold mb-2 text-lg">Journal Entries</h3>

              {entries.map((entry, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-2 items-center mb-2"
                >
                  <select
                    value={entry.account_id}
                    onChange={(e) =>
                      handleEntryChange(index, "account_id", e.target.value)
                    }
                    className="col-span-5 border border-green-600 rounded-lg p-2"
                    required
                  >
                    <option value="">Select Account</option>
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} ({acc.type})
                      </option>
                    ))}
                  </select>

                  <select
                    value={entry.type}
                    onChange={(e) =>
                      handleEntryChange(index, "type", e.target.value)
                    }
                    className="col-span-3 border border-green-600 rounded-lg p-2"
                  >
                    <option value="debit">Debit</option>
                    <option value="credit">Credit</option>
                  </select>

                  <input
                    type="number"
                    step="0.01"
                    value={entry.amount}
                    onChange={(e) =>
                      handleEntryChange(index, "amount", e.target.value)
                    }
                    className="col-span-3 border border-green-600 rounded-lg p-2"
                    placeholder="Amount"
                    required
                  />

                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeEntry(index)}
                      className="col-span-1 text-red-500 font-bold hover:text-red-700"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addEntry}
                className="mt-2 text-blue-600 font-semibold hover:underline cursor-pointer"
              >
                + Add another entry
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:scale-105 transition cursor-pointer"
            >
              Save Transaction
            </button>
          </form>

          {/* Reports Link */}
          <div className="text-center mt-6">
            <Link
              href="/reports"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:scale-105  transition"
            >
              View Reports
            </Link>
          </div>
        </div>

        {/* Right: Lottie Animation */}
        <div className="flex items-center justify-center">
          <Lottie
            path="/lottie/finance-graphs.json"
            autoplay
            loop
            style={{ width: 400, height: 400 }}
          />
        </div>
      </div>
    </div>
  );
}
