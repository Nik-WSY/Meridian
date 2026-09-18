import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../auth-context";
import { Nav } from "../components/Nav";
import type { Expense } from "../types";

function statusClass(status: Expense["status"]) {
  return `mer-status-${status}`;
}

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
    <div>
      <Nav />
      <div className="mer-page">
        <div className="mer-page-header">
          <h1 className="mer-page-title">Approval Queue</h1>
          <span className="mer-muted mer-page-count">
            {expenses.filter((e) => e.status === "pending").length} Open
          </span>
        </div>
        <div className="mer-page-panel-enter">
          {loading ? (
            <p className="mer-muted">Loading...</p>
          ) : expenses.length === 0 ? (
            <p className="mer-muted">Nothing submitted yet.</p>
          ) : (
            <table className="mer-table">
              <thead>
                <tr>
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
                  <tr key={expense.id}>
                    <td>{expense.description}</td>
                    <td>{expense.category}</td>
                    <td>{expense.port ?? "-"}</td>
                    <td>{expense.date_needed ?? "-"}</td>
                    <td>&euro;{(expense.amount_cents / 100).toFixed(2)}</td>
                    <td>
                      <span className={`mer-status-pill ${statusClass(expense.status)}`}>{expense.status}</span>
                    </td>
                    <td>
                      {expense.receipt_path ? (
                        <button
                          type="button"
                          className="mer-link-btn"
                          onClick={() => viewReceipt(expense.receipt_path!)}
                        >
                          View
                        </button>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      {expense.status === "pending" && (
                        <span style={{ display: "flex", gap: 8 }}>
                          <button
                            type="button"
                            className="mer-btn-primary"
                            style={{ padding: "6px 14px" }}
                            disabled={actingOn === expense.id}
                            onClick={() => decide(expense.id, "approved")}
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            className="mer-btn-secondary"
                            style={{ padding: "6px 14px" }}
                            disabled={actingOn === expense.id}
                            onClick={() => decide(expense.id, "rejected")}
                          >
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
      </div>
    </div>
  );
}