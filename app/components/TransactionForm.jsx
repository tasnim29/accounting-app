"use client"; // Required for client-side interactivity

import { useState, useEffect } from "react";

export default function TransactionForm() {
  const [accounts, setAccounts] = useState([]);
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [entries, setEntries] = useState([
    { account_id: "", type: "debit", amount: "" },
  ]);

  // Fetch accounts from API
  useEffect(() => {
    fetch("/api/test-connection") // We'll replace this with a proper accounts API later
      .then((res) => res.json())
      .then((data) => setAccounts(data));
  }, []);

  // Add new entry row
  const addEntry = () => {
    setEntries([...entries, { account_id: "", type: "debit", amount: "" }]);
  };

  // Remove entry row
  const removeEntry = (index) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  // Handle input change
  const handleEntryChange = (index, field, value) => {
    const newEntries = [...entries];
    newEntries[index][field] = value;
    setEntries(newEntries);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: total debits = total credits
    const totalDebit = entries
      .filter((e) => e.type === "debit")
      .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
    const totalCredit = entries
      .filter((e) => e.type === "credit")
      .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

    if (totalDebit !== totalCredit) {
      alert("Total Debits must equal Total Credits!");
      return;
    }

    // Submit to API
    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, description, entries }),
    });

    if (res.ok) {
      alert("Transaction saved!");
      setDate("");
      setDescription("");
      setEntries([{ account_id: "", type: "debit", amount: "" }]);
    } else {
      alert("Error saving transaction");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Add Transaction</h2>

      <div className="mb-4">
        <label className="block font-semibold">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded p-2 w-full"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border rounded p-2 w-full"
          required
        />
      </div>

      <div>
        <h3 className="font-semibold mb-2">Entries</h3>
        {entries.map((entry, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <select
              value={entry.account_id}
              onChange={(e) =>
                handleEntryChange(index, "account_id", e.target.value)
              }
              className="border rounded p-2 flex-1"
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
              onChange={(e) => handleEntryChange(index, "type", e.target.value)}
              className="border rounded p-2"
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
              className="border rounded p-2 w-32"
              placeholder="Amount"
              required
            />

            {index > 0 && (
              <button
                type="button"
                onClick={() => removeEntry(index)}
                className="bg-red-500 text-white px-2 rounded"
              >
                X
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addEntry}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
        >
          Add Entry
        </button>
      </div>

      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded mt-4"
      >
        Save Transaction
      </button>
    </form>
  );
}
