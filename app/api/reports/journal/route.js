import pool from "@/lib/db";

export async function GET() {
  try {
    // Query all transactions with their entries and account info
    const result = await pool.query(`
      SELECT 
        t.id AS transaction_id,
        t.date,
        t.description,
        e.id AS entry_id,
        e.type,
        e.amount,
        a.name AS account_name,
        a.type AS account_type
      FROM transactions t
      JOIN transaction_entries e ON t.id = e.transaction_id
      JOIN accounts a ON e.account_id = a.id
      ORDER BY t.date, t.id, e.id
    `);

    // Group entries by transaction
    const transactionsMap = {};
    result.rows.forEach((row) => {
      if (!transactionsMap[row.transaction_id]) {
        transactionsMap[row.transaction_id] = {
          id: row.transaction_id,
          date: row.date,
          description: row.description,
          entries: [],
        };
      }
      transactionsMap[row.transaction_id].entries.push({
        id: row.entry_id,
        account_name: row.account_name,
        account_type: row.account_type,
        type: row.type,
        amount: parseFloat(row.amount),
      });
    });

    const transactions = Object.values(transactionsMap);

    return new Response(JSON.stringify(transactions), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to fetch journal" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
