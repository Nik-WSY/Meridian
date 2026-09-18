import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAuth } from "../auth-context";
import { Nav } from "../components/Nav";
import type { Expense, ExpenseCategory } from "../types";

const CATEGORIES: { value: ExpenseCategory; label: string }[] = [
  { value: "provisioning", label: "Provisioning" },
  { value: "fuel", label: "Fuel" },
  { value: "docking", label: "Docking & Port Fees" },
  { value: "maintenance", label: "Maintenance" },
  { value: "other", label: "Other" },
];

function statusClass(status: Expense["status"]) {
  return `mer-status-${status}`;
}

export default function SubmitPage() {
  const { user } = useAuth();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("provisioning");
  const [port, setPort] = useState("");
  const [dateNeeded, setDateNeeded] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  async function loadExpenses() {
    if (!user) return;
    setLoadingList(true);
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("submitter_id", user.id)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Failed to load expenses", error);
    } else {
      setExpenses(data as Expense[]);
    }
    setLoadingList(false);
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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const amountCents = Math.round(parseFloat(amount) * 100);
    if (!description.trim() || !Number.isFinite(amountCents) || amountCents <= 0) {
      setError("Enter a description and an amount greater than zero.");
      return;
    }
    if (!user) return;

    setSubmitting(true);

    let receiptPath: string | null = null;
    if (file) {
      const path = `${user.id}/${crypto.randomUUID()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from("receipts").upload(path, file);
      if (uploadError) {
        setSubmitting(false);
        setError(`Receipt upload failed: ${uploadError.message}`);
        return;
      }
      receiptPath = path;
    }

    const { error: insertError } = await supabase.from("expenses").insert({
      submitter_id: user.id,
      description: description.trim(),
      amount_cents: amountCents,
      category,
      port: port.trim() || null,
      date_needed: dateNeeded || null,
      receipt_path: receiptPath,
    });
    setSubmitting(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setDescription("");
    setAmount("");
    setPort("");
    setDateNeeded("");
    setCategory("provisioning");
    setFile(null);
    loadExpenses();
  }

  return (
    <div>
      <Nav />
      <div className="mer-page">
        <Link to="/dashboard" className="mer-page-back mer-muted">
          &larr; Dashboard
        </Link>
        <div className="mer-page-header">
          <h1 className="mer-page-title">Submit an expense</h1>
        </div>

        <div className="mer-submit-grid">
          <div className="mer-submit-panel">
            <div className="mer-submit-panel-title">New Request</div>
            <form onSubmit={handleSubmit} className="mer-submit-form">
              <div>
                <label>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value as ExpenseCategory)}>
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>
                  Amount (EUR) <span className="mer-required">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="mer-submit-field-full">
                <label>
                  Description <span className="mer-required">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Provisioning run for guest arrival"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div>
                <label>Port / destination (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Palma de Mallorca"
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                />
              </div>
              <div>
                <label>Date needed (optional)</label>
                <input type="date" value={dateNeeded} onChange={(e) => setDateNeeded(e.target.value)} />
              </div>

              <div className="mer-submit-field-full">
                <label>Receipt (optional)</label>
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
              </div>

              {error && <p className="mer-error mer-submit-field-full">{error}</p>}

              <div className="mer-submit-actions">
                <button type="submit" className="mer-btn-primary" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit request"}
                </button>
              </div>
            </form>
          </div>

          <div className="mer-submit-panel">
            <div className="mer-submit-panel-title">Your Expenses</div>
            {loadingList ? (
              <p className="mer-muted">Loading&hellip;</p>
            ) : expenses.length === 0 ? (
              <p className="mer-muted">No expenses yet.</p>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
