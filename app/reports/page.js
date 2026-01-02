"use client";

import { useState } from "react";
import Link from "next/link";
import BalanceSheet from "../components/BalanceSheet";
import IncomeStatement from "../components/IncomeStatement";
import JournalReport from "../components/JournalReport";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("journal");

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Reports</h1>

        <Link
          href="/"
          className="mt-2 text-blue-600 font-semibold hover:underline "
        >
          + New Transaction
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab("journal")}
          className={`px-4 py-2 rounded-t ${
            activeTab === "journal"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Journal
        </button>

        <button
          onClick={() => setActiveTab("balance")}
          className={`px-4 py-2 rounded-t ${
            activeTab === "balance"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Balance Sheet
        </button>

        <button
          onClick={() => setActiveTab("income")}
          className={`px-4 py-2 rounded-t ${
            activeTab === "income"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Income Statement
        </button>
      </div>

      {/* Content */}
      <div className="rounded-b shadow bg-white max-w-6xl mx-auto p-4">
        {activeTab === "journal" && <JournalReport />}
        {activeTab === "balance" && <BalanceSheet />}
        {activeTab === "income" && <IncomeStatement />}
      </div>
    </div>
  );
}
