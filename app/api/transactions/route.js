import pool from "@/lib/db";

export async function POST(req) {
  try {
    const { date, description, entries } = await req.json();

    if (!date || !entries || entries.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await pool.query("BEGIN");

    const transactionResult = await pool.query(
      "INSERT INTO transactions (date, description) VALUES ($1, $2) RETURNING id",
      [date, description]
    );

    const transactionId = transactionResult.rows[0].id;

    for (let entry of entries) {
      await pool.query(
        "INSERT INTO transaction_entries (transaction_id, account_id, type, amount) VALUES ($1, $2, $3, $4)",
        [transactionId, entry.account_id, entry.type, entry.amount]
      );
    }

    await pool.query("COMMIT");

    return new Response(
      JSON.stringify({ message: "Transaction saved successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error(err);
    await pool.query("ROLLBACK");
    return new Response(
      JSON.stringify({ error: "Failed to save transaction" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
