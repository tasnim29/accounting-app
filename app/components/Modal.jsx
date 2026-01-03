"use client";

export default function Modal({
  isOpen,
  onClose,
  editingTx,
  setEditingTx,
  accounts,
  saveEdit,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className={`bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative transform transition-transform duration-300 ${
          isOpen ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>

        {editingTx && (
          <>
            <h3 className="text-xl font-bold mb-4">Edit Transaction</h3>

            <div className="mb-4">
              <label className="block font-semibold">Date</label>
              <input
                type="date"
                value={editingTx.date}
                onChange={(e) =>
                  setEditingTx({ ...editingTx, date: e.target.value })
                }
                className="border rounded p-2 w-full"
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold">Description</label>
              <input
                type="text"
                value={editingTx.description}
                onChange={(e) =>
                  setEditingTx({ ...editingTx, description: e.target.value })
                }
                className="border rounded p-2 w-full"
              />
            </div>

            <div>
              <h4 className="font-semibold mb-2">Entries</h4>
              {editingTx.entries.map((entry, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <select
                    value={entry.account_id ?? ""}
                    onChange={(e) => {
                      const newEntries = [...editingTx.entries];
                      newEntries[index].account_id = Number(e.target.value);
                      setEditingTx({ ...editingTx, entries: newEntries });
                    }}
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
                    onChange={(e) => {
                      const newEntries = [...editingTx.entries];
                      newEntries[index].type = e.target.value;
                      setEditingTx({ ...editingTx, entries: newEntries });
                    }}
                    className="border rounded p-2"
                  >
                    <option value="debit">Debit</option>
                    <option value="credit">Credit</option>
                  </select>

                  <input
                    type="number"
                    step="0.01"
                    value={entry.amount}
                    onChange={(e) => {
                      const newEntries = [...editingTx.entries];
                      newEntries[index].amount = e.target.value;
                      setEditingTx({ ...editingTx, entries: newEntries });
                    }}
                    className="border rounded p-2 w-32"
                    placeholder="Amount"
                  />

                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newEntries = editingTx.entries.filter(
                          (_, i) => i !== index
                        );
                        setEditingTx({ ...editingTx, entries: newEntries });
                      }}
                      className="bg-red-500 text-white px-2 rounded"
                    >
                      X
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  setEditingTx({
                    ...editingTx,
                    entries: [
                      ...editingTx.entries,
                      { account_id: "", type: "debit", amount: "" },
                    ],
                  })
                }
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
              >
                Add Entry
              </button>
            </div>

            <div className="flex gap-2 mt-4 justify-end">
              <button
                onClick={saveEdit}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={onClose}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
