import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAuth } from "../auth-context";
import type { Expense, ExpenseCategory } from "../types";

const CATEGORIES: { value: ExpenseCategory; label: string }[] = [
  { value: "provisioning", label: "Provisioning" },
  { value: "fuel", label: "Fuel" },
  { value: "docking", label: "Docking & Port Fees" },
  { value: "maintenance", label: "Maintenance" },
  { value: "other", label: "Other" },
];

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
    <div style={{ maxWidth: 640, margin: "60px auto", fontFamily: "system-ui" }}>
      <p>
        <Link to="/">&larr; Dashboard</Link>
      </p>
      <h1>Submit an expense</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
        <label>
          Category
          <select value={category} onChange={(e) => setCategory(e.target.value as ExpenseCategory)}>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="number"
          step="0.01"
          min="0.01"
          placeholder="Amount (EUR)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Port / destination (optional)"
          value={port}
          onChange={(e) => setPort(e.target.value)}
        />
        <label>
          Date needed (optional)
          <input type="date" value={dateNeeded} onChange={(e) => setDateNeeded(e.target.value)} />
        </label>
        <label>
          Receipt (optional)
          <input
            type="file"
            accept="application/pdf,image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>
        {error && <p style={{ color: "crimson" }}>{error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </form>

      <h2>Your expenses</h2>
      {loadingList ? (
        <p>Loading...</p>
      ) : expenses.length === 0 ? (
        <p>No expenses yet.</p>
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
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}