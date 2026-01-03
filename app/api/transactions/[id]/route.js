import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  const { id } = await params;
  const transactionId = Number(id);
  console.log("Deleting transaction id:", transactionId);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      "DELETE FROM transaction_entries WHERE transaction_id = $1",
      [transactionId]
    );

    await client.query("DELETE FROM transactions WHERE id = $1", [
      transactionId,
    ]);

    await client.query("COMMIT");

    return NextResponse.json({ message: "Transaction deleted" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("DELETE ERROR:", err);
    return NextResponse.json(
      { error: "Failed to delete transaction", details: err.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function PUT(req, { params }) {
  const { id } = await params;
  const transactionId = Number(id);
  const data = await req.json();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      "UPDATE transactions SET date = $1, description = $2 WHERE id = $3",
      [data.date, data.description, transactionId]
    );

    await client.query(
      "DELETE FROM transaction_entries WHERE transaction_id = $1",
      [transactionId]
    );

    for (const e of data.entries) {
      await client.query(
        "INSERT INTO transaction_entries (transaction_id, account_id, type, amount) VALUES ($1, $2, $3, $4)",
        [transactionId, e.account_id, e.type, e.amount]
      );
    }

    await client.query("COMMIT");
    return NextResponse.json({ message: "Transaction updated" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update transaction", details: err.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
