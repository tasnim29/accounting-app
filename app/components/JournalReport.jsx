"use client";

import { useEffect, useState } from "react";
import Modal from "./Modal";
import Swal from "sweetalert2";
import { FiEdit, FiTrash2 } from "react-icons/fi";

export default function JournalReport() {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [editingTx, setEditingTx] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch accounts & transactions
  useEffect(() => {
    fetch("/api/accounts")
      .then((res) => res.json())
      .then((data) => setAccounts(data));

    fetch("/api/reports/journal")
      .then((res) => res.json())
      .then((data) => setTransactions(data));
  }, []);

  const startEdit = (tx) => {
    setEditingTx(tx);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => setEditingTx(null), 300);
  };

  const saveEdit = async () => {
    // Validate entries
    for (const e of editingTx.entries) {
      if (!e.account_id || !e.amount) {
        Swal.fire({
          icon: "warning",
          title: "Oops!",
          text: "All entries must have an account and an amount.",
        });
        return;
      }
    }

    const totalDebit = editingTx.entries
      .filter((e) => e.type === "debit")
      .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
    const totalCredit = editingTx.entries
      .filter((e) => e.type === "credit")
      .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

    if (totalDebit !== totalCredit) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Total Debits must equal Total Credits!",
      });
      return;
    }

    try {
      const entriesToSave = editingTx.entries.filter(
        (e) => e.account_id && e.amount
      );
      const dataToSend = { ...editingTx, entries: entriesToSave };

      const res = await fetch(`/api/transactions/${editingTx.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (res.ok) {
        // Merge account names for display
        const updatedTx = {
          ...dataToSend,
          entries: dataToSend.entries.map((e) => ({
            ...e,
            account_name:
              accounts.find((acc) => String(acc.id) === String(e.account_id))
                ?.name || "",
          })),
        };

        setTransactions((prev) =>
          prev.map((tx) => (tx.id === editingTx.id ? updatedTx : tx))
        );
        closeModal();
      } else {
        const data = await res.json();
        alert("Failed to update: " + data.details);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update transaction");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      // call DELETE API
      const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
      if (res.ok) {
        setTransactions((prev) => prev.filter((tx) => tx.id !== id));
        Swal.fire("Deleted!", "Transaction has been deleted.", "success");
      } else {
        Swal.fire("Error", "Failed to delete transaction", "error");
      }
    }
  };

  return (
    <div>
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
            {transactions.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="border px-3 py-6 text-center text-gray-500"
                >
                  No transactions found.
                </td>
              </tr>
            ) : (
              transactions.map((tx) =>
                tx.entries.map((entry, index) => (
                  <tr key={entry.id} className="border-t">
                    <td className="border px-3 py-2">
                      {index === 0 ? tx.date : ""}
                    </td>
                    <td className="border px-3 py-2">
                      {index === 0 ? tx.description : ""}
                    </td>
                    <td
                      className={`border px-3 py-2 ${
                        entry.type === "credit" ? "pl-8" : ""
                      }`}
                    >
                      {entry.account_name}
                    </td>
                    <td className="border px-3 py-2 text-right">
                      {entry.type === "debit" && entry.amount
                        ? Number(entry.amount).toFixed(2)
                        : ""}
                    </td>
                    <td className="border px-3 py-2 text-right">
                      {entry.type === "credit" && entry.amount
                        ? Number(entry.amount).toFixed(2)
                        : ""}
                    </td>

                    {index === 0 && (
                      <td className="border px-3 py-2 text-right">
                        <div className="flex gap-2 justify-center items-center">
                          <button
                            onClick={() => startEdit(tx)}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded cursor-pointer"
                            title="Edit"
                          >
                            <FiEdit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(tx.id)}
                            className="text-red-600 hover:text-red-800 p-1 rounded cursor-pointer"
                            title="Delete"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {editingTx && (
        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          editingTx={editingTx}
          setEditingTx={setEditingTx}
          accounts={accounts}
          saveEdit={saveEdit}
        />
      )}
    </div>
  );
}
