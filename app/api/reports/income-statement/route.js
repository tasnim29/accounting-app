import pool from "@/lib/db";

export async function GET() {
  try {
    // Get revenue and expense accounts with their totals
    const result = await pool.query(`
      SELECT 
        a.id,
        a.name,
        a.type,
        COALESCE(SUM(CASE WHEN e.type='debit' THEN e.amount END),0) AS total_debit,
        COALESCE(SUM(CASE WHEN e.type='credit' THEN e.amount END),0) AS total_credit
      FROM accounts a
      LEFT JOIN transaction_entries e ON a.id = e.account_id
      WHERE a.type IN ('Revenue','Expense')
      GROUP BY a.id, a.name, a.type
      ORDER BY a.type, a.name
    `);

    const accounts = result.rows.map((acc) => {
      let balance;
      if (acc.type === "Revenue") {
        balance = parseFloat(acc.total_credit) - parseFloat(acc.total_debit);
      } else {
        // Expense
        balance = parseFloat(acc.total_debit) - parseFloat(acc.total_credit);
      }
      return {
        id: acc.id,
        name: acc.name,
        type: acc.type,
        amount: balance.toFixed(2),
      };
    });

    const totalRevenue = accounts
      .filter((a) => a.type === "Revenue")
      .reduce((sum, a) => sum + parseFloat(a.amount), 0)
      .toFixed(2);

    const totalExpenses = accounts
      .filter((a) => a.type === "Expense")
      .reduce((sum, a) => sum + parseFloat(a.amount), 0)
      .toFixed(2);

    const netProfit = (totalRevenue - totalExpenses).toFixed(2);

    return new Response(
      JSON.stringify({ accounts, totalRevenue, totalExpenses, netProfit }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch income statement" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
