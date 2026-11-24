import Link from "next/link";
import { Navbar } from "../../../components/Navbar";
import { createLoan } from "../../actions/loans";

const API_BASE = process.env.API_BASE_URL || "http://localhost:8001";

async function getTools() {
  const response = await fetch(`${API_BASE}/api/tools/`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Could not load tools.");
  }

  return response.json();
}

async function getBorrowers() {
  const response = await fetch(`${API_BASE}/api/borrowers/`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Could not load borrowers.");
  }

  return response.json();
}

const fieldStyle = {
  width: "100%",
  padding: "0.55rem",
  border: "1px solid #ccc",
  borderRadius: 4,
  boxSizing: "border-box",
};

const groupStyle = {
  marginBottom: "1rem",
};

const labelStyle = {
  display: "block",
  marginBottom: "0.35rem",
  fontWeight: 600,
};

export default async function NewLoanPage() {
  const [tools, borrowers] = await Promise.all([
    getTools(),
    getBorrowers(),
  ]);

  return (
    <div>
      <Navbar />

      <main
        style={{
          padding: "1.5rem",
          fontFamily: "system-ui, sans-serif",
          maxWidth: 680,
        }}
      >
        <h1>Loan a Tool</h1>
        <p style={{ color: "#555" }}>
          Checkout time is recorded automatically when you save this loan.
        </p>

        {tools.length === 0 ? (
          <p style={{ marginTop: "1.5rem" }}>
            Add at least one tool before recording a loan.
          </p>
        ) : borrowers.length === 0 ? (
          <section
            style={{
              marginTop: "1.5rem",
              border: "1px solid #d0d5dd",
              borderRadius: 8,
              padding: "1rem",
              background: "#fcfcfd",
            }}
          >
            <p style={{ marginTop: 0 }}>
              Add a borrower before creating a loan.
            </p>

            <Link href="/borrowers/new?return_to=/loans/new" style={{ textDecoration: "none" }}>
              <button style={primaryButtonStyle}>Add New Borrower</button>
            </Link>
          </section>
        ) : (
          <form action={createLoan} style={{ marginTop: "1.5rem" }}>
            <div style={groupStyle}>
              <label style={labelStyle}>Tool</label>
              <select name="tool_id" required defaultValue="" style={fieldStyle}>
                <option value="" disabled>Select a tool</option>
                {tools.map((tool) => (
                  <option key={tool.id} value={tool.id}>
                    {tool.name}
                    {tool.brand ? ` — ${tool.brand}` : ""}
                    {tool.model ? ` ${tool.model}` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div style={groupStyle}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "1rem",
                  marginBottom: "0.35rem",
                  flexWrap: "wrap",
                }}
              >
                <label style={{ fontWeight: 600 }}>Borrower</label>

                <Link
                  href="/borrowers/new?return_to=/loans/new"
                  style={{
                    color: "#175cd3",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                  }}
                >
                  + Add New Borrower
                </Link>
              </div>

              <select name="borrower_id" required defaultValue="" style={fieldStyle}>
                <option value="" disabled>Select a borrower</option>
                {borrowers.map((borrower) => (
                  <option key={borrower.id} value={borrower.id}>
                    {borrower.name}
                    {borrower.phone ? ` — ${borrower.phone}` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div style={groupStyle}>
                <label style={labelStyle}>Return ETA Date</label>
                <input name="due_date" type="date" style={fieldStyle} />
              </div>

              <div style={groupStyle}>
                <label style={labelStyle}>Return ETA Time</label>
                <input
                  name="due_time"
                  type="time"
                  defaultValue="17:00"
                  style={fieldStyle}
                />
              </div>
            </div>

            <div style={groupStyle}>
              <label style={labelStyle}>Condition at Checkout</label>
              <input
                name="condition_at_checkout"
                placeholder="e.g. Good, fully charged"
                style={fieldStyle}
              />
            </div>

            <div style={groupStyle}>
              <label style={labelStyle}>Checkout Notes</label>
              <textarea name="notes" rows="4" style={fieldStyle} />
            </div>

            <button type="submit" style={primaryButtonStyle}>
              Check Out Tool
            </button>
          </form>
        )}
      </main>
    </div>
  );
}

const primaryButtonStyle = {
  padding: "0.6rem 1rem",
  cursor: "pointer",
  border: "1px solid #175cd3",
  borderRadius: 6,
  background: "#175cd3",
  color: "#fff",
  fontWeight: 600,
};
