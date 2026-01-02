import pool from "@/lib/db";

export async function GET() {
  try {
    // Get all accounts with sum of debit and credit
    const result = await pool.query(`
      SELECT 
        a.id,
        a.name,
        a.type,
        COALESCE(SUM(CASE WHEN e.type='debit' THEN e.amount END),0) AS total_debit,
        COALESCE(SUM(CASE WHEN e.type='credit' THEN e.amount END),0) AS total_credit
      FROM accounts a
      LEFT JOIN transaction_entries e ON a.id = e.account_id
      GROUP BY a.id, a.name, a.type
      ORDER BY a.type, a.name
    `);

    // Calculate balance per account
    const accounts = result.rows.map((acc) => {
      let balance;
      if (["Asset", "Expense"].includes(acc.type)) {
        balance = parseFloat(acc.total_debit) - parseFloat(acc.total_credit);
      } else {
        // Liabilities, Equity, Revenue
        balance = parseFloat(acc.total_credit) - parseFloat(acc.total_debit);
      }
      return {
        id: acc.id,
        name: acc.name,
        type: acc.type,
        balance: balance.toFixed(2),
      };
    });

    return new Response(JSON.stringify(accounts), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch balance sheet" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
