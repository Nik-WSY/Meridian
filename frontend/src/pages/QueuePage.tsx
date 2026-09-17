import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAuth } from "../auth-context";
import type { Expense } from "../types";

export default function QueuePage() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingOn, setActingOn] = useState<string | null>(null);

  async function loadExpenses() {
    setLoading(true);
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Failed to load expenses", error);
    } else {
      setExpenses(data as Expense[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadExpenses();
  }, []);

  async function viewReceipt(path: string) {
    const { data, error } = await supabase.storage.from("receipts").createSignedUrl(path, 60);
    if (error || !data) {
      console.error("Failed to create signed URL", error);
      return;
    }
    window.open(data.signedUrl, "_blank");
  }

  async function decide(id: string, status: "approved" | "rejected") {
    if (!user) return;
    setActingOn(id);
    const { error } = await supabase
      .from("expenses")
      .update({ status, reviewed_by: user.id, reviewed_at: new Date().toISOString() })
      .eq("id", id);
    setActingOn(null);
    if (error) {
      console.error("Failed to update expense", error);
      return;
    }
    loadExpenses();
  }

  return (
    <div style={{ maxWidth: 960, margin: "60px auto", fontFamily: "system-ui" }}>
      <p>
        <Link to="/">&larr; Dashboard</Link>
      </p>
      <h1>Approval queue</h1>
      {loading ? (
        <p>Loading...</p>
      ) : expenses.length === 0 ? (
        <p>Nothing submitted yet.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>
              <th>Description</th>
              <th>Category</th>
              <th>Port</th>
              <th>Needed</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Receipt</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id} style={{ borderBottom: "1px solid #eee" }}>
                <td>{expense.description}</td>
                <td>{expense.category}</td>
                <td>{expense.port ?? "-"}</td>
                <td>{expense.date_needed ?? "-"}</td>
                <td>&euro;{(expense.amount_cents / 100).toFixed(2)}</td>
                <td>{expense.status}</td>
                <td>
                  {expense.receipt_path ? (
                    <button type="button" onClick={() => viewReceipt(expense.receipt_path!)}>
                      View
                    </button>
                  ) : (
                    "-"
                  )}
                </td>
                <td>
                  {expense.status === "pending" && (
                    <span style={{ display: "flex", gap: 8 }}>
                      <button disabled={actingOn === expense.id} onClick={() => decide(expense.id, "approved")}>
                        Approve
                      </button>
                      <button disabled={actingOn === expense.id} onClick={() => decide(expense.id, "rejected")}>
                        Reject
                      </button>
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}