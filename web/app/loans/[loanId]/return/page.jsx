import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "../../../../components/Navbar";
import { completeToolReturn } from "../../../actions/returns";

const API_BASE = process.env.API_BASE_URL || "http://192.168.50.37:8001";

async function fetchJson(path) {
  const response = await fetch(`${API_BASE}${path}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Could not load ${path}`);
  }

  return response.json();
}

function formatDate(value) {
  if (!value) return "No return ETA recorded";

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

const fieldStyle = {
  width: "100%",
  padding: "0.55rem",
  border: "1px solid #98a2b3",
  borderRadius: 6,
  boxSizing: "border-box",
  fontFamily: "inherit",
};

const labelStyle = {
  display: "block",
  marginBottom: "0.35rem",
  fontWeight: 600,
  color: "#344054",
};

export default async function ReturnToolPage({ params }) {
  const loanId = Number(params.loanId);

  if (!Number.isInteger(loanId) || loanId < 1) {
    notFound();
  }

  const loan = await fetchJson(`/api/loans/${loanId}`);

  if (!loan || loan.return_date) {
    notFound();
  }

  const tool = await fetchJson(`/api/tools/${loan.tool_id}`);

  if (!tool) {
    notFound();
  }

  return (
    <div>
      <Navbar />

      <main
        style={{
          padding: "1.5rem",
          fontFamily: "system-ui, sans-serif",
          maxWidth: 680,
          margin: "0 auto",
        }}
      >
        <Link
          href="/loans"
          style={{
            display: "inline-block",
            marginBottom: "1rem",
            color: "#175cd3",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          ← Cancel and go back
        </Link>

        <section
          style={{
            border: "1px solid #d0d5dd",
            borderRadius: 10,
            background: "#fff",
            padding: "1.25rem",
            boxShadow: "0 1px 2px rgba(16, 24, 40, 0.05)",
          }}
        >
          <h1 style={{ margin: 0, color: "#101828" }}>Return Tool</h1>

          <p style={{ margin: "0.5rem 0 0", color: "#667085" }}>
            Record the tool’s condition before completing the return.
          </p>

          <section
            style={{
              marginTop: "1.25rem",
              padding: "1rem",
              borderRadius: 8,
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
            }}
          >
            <div style={{ color: "#667085", fontSize: "0.82rem" }}>Tool</div>
            <div style={{ marginTop: "0.2rem", color: "#101828", fontWeight: 700 }}>
              {tool.name}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "0.8rem",
                marginTop: "1rem",
              }}
            >
              <Info label="Borrower" value={loan.borrower_name} />
              <Info label="Checked Out" value={formatDate(loan.checkout_date)} />
              <Info label="Return ETA" value={formatDate(loan.due_date)} />
              <Info
                label="Checkout Condition"
                value={loan.condition_at_checkout || "Not recorded"}
              />
            </div>
          </section>

          <form action={completeToolReturn} style={{ marginTop: "1.5rem" }}>
            <input type="hidden" name="loan_id" value={loan.id} />
            <input type="hidden" name="return_to" value="/loans" />

            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle}>Condition at Return</label>
              <select
                name="condition_at_return"
                required
                defaultValue="good"
                style={fieldStyle}
              >
                <option value="new">New</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="needs repair">Needs repair</option>
                <option value="damaged">Damaged</option>
              </select>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle}>Return Notes</label>
              <textarea
                name="return_notes"
                rows="5"
                placeholder="Optional: damage, missing accessories, maintenance needed, or other return details."
                style={fieldStyle}
              />
            </div>

            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <button
                type="submit"
                style={{
                  padding: "0.6rem 1rem",
                  cursor: "pointer",
                  border: "1px solid #067647",
                  borderRadius: 6,
                  background: "#067647",
                  color: "#fff",
                  fontWeight: 700,
                }}
              >
                Complete Return
              </button>

              <Link href="/loans" style={{ textDecoration: "none" }}>
                <button
                  type="button"
                  style={{
                    padding: "0.6rem 1rem",
                    cursor: "pointer",
                    border: "1px solid #98a2b3",
                    borderRadius: 6,
                    background: "#fff",
                    color: "#344054",
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </button>
              </Link>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <div style={{ color: "#667085", fontSize: "0.78rem" }}>{label}</div>
      <div style={{ marginTop: "0.2rem", color: "#344054", fontWeight: 600 }}>
        {value}
      </div>
    </div>
  );
}
