import Link from "next/link";
import { Navbar } from "../../components/Navbar";

const API_BASE = process.env.API_BASE_URL || "http://192.168.50.37:8001";

async function getLoans() {
  const response = await fetch(`${API_BASE}/api/loans/`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Could not load loans.");
  }

  return response.json();
}

async function getTools() {
  const response = await fetch(`${API_BASE}/api/tools/`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return [];
  }

  return response.json();
}

function formatDate(value) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function LoansPage() {
  const [loans, tools] = await Promise.all([getLoans(), getTools()]);
  const toolNames = new Map(tools.map((tool) => [tool.id, tool.name]));

  const activeLoans = loans.filter((loan) => !loan.return_date);
  const returnedLoans = loans.filter((loan) => loan.return_date);

  return (
    <div>
      <Navbar />

      <main
        style={{
          marginLeft: "245px",
          width: "calc(100% - 245px)",
          minHeight: "100vh",
          boxSizing: "border-box",
          padding: "1.5rem",
          fontFamily: "system-ui, sans-serif",
          overflowX: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1 style={{ marginBottom: "0.25rem" }}>Tool Loans</h1>
            <p style={{ marginTop: 0, color: "#555" }}>
              Track who has a tool and when it is expected back.
            </p>
          </div>

          <Link href="/loans/new" style={{ textDecoration: "none" }}>
            <button style={{ padding: "0.55rem 1rem", cursor: "pointer" }}>
              Loan a Tool
            </button>
          </Link>
        </div>

        <ActiveLoansSection loans={activeLoans} toolNames={toolNames} />
        <ReturnedLoansSection loans={returnedLoans} toolNames={toolNames} />
      </main>
    </div>
  );
}

function ActiveLoansSection({ loans, toolNames }) {
  return (
    <section style={{ marginTop: "2rem" }}>
      <h2>Active Loans</h2>

      {loans.length === 0 ? (
        <p>No active loans.</p>
      ) : (
        <div style={{ width: "100%", overflowX: "auto", overflowY: "visible" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
            <thead>
              <tr>
                {["Tool", "Borrower", "Checked Out", "Return ETA", "Status", "Action"].map((heading) => (
                  <th key={heading} style={headerCellStyle}>{heading}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loans.map((loan) => {
                const overdue =
                  loan.due_date &&
                  new Date(loan.due_date).getTime() < Date.now();

                return (
                  <tr key={loan.id}>
                    <td style={cellStyle}>
                      <Link href={`/tools/${loan.tool_id}`} style={toolLinkStyle}>
                        {toolNames.get(loan.tool_id) || `Tool #${loan.tool_id}`}
                      </Link>
                    </td>
                    <td style={cellStyle}>{loan.borrower_name}</td>
                    <td style={cellStyle}>{formatDate(loan.checkout_date)}</td>
                    <td
                      style={{
                        ...cellStyle,
                        color: overdue ? "#b42318" : "#344054",
                        fontWeight: overdue ? 700 : 400,
                      }}
                    >
                      {formatDate(loan.due_date)}
                    </td>
                    <td style={cellStyle}>{overdue ? "Overdue" : "Out"}</td>
                    <td style={cellStyle}>
                      <Link href={`/loans/${loan.id}/return`} style={{ textDecoration: "none" }}>
                        <button type="button" style={returnButtonStyle}>Return Tool</button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function ReturnedLoansSection({ loans, toolNames }) {
  return (
    <section style={{ marginTop: "2rem" }}>
      <h2>Returned Loans</h2>

      {loans.length === 0 ? (
        <p>No returned loans.</p>
      ) : (
        <div style={{ width: "100%", overflowX: "auto", overflowY: "visible" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1450 }}>
            <thead>
              <tr>
                {[
                  "Tool",
                  "Borrower",
                  "Checked Out",
                  "Return ETA",
                  "Returned",
                  "Return Condition",
                  "Checkout Notes",
                  "Return Notes",
                ].map((heading) => (
                  <th key={heading} style={headerCellStyle}>{heading}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loans.map((loan) => (
                <tr key={loan.id}>
                  <td style={cellStyle}>
                    <Link href={`/tools/${loan.tool_id}`} style={toolLinkStyle}>
                      {toolNames.get(loan.tool_id) || `Tool #${loan.tool_id}`}
                    </Link>
                  </td>
                  <td style={cellStyle}>{loan.borrower_name}</td>
                  <td style={cellStyle}>{formatDate(loan.checkout_date)}</td>
                  <td style={cellStyle}>{formatDate(loan.due_date)}</td>
                  <td style={cellStyle}>{formatDate(loan.return_date)}</td>
                  <td style={cellStyle}>{loan.condition_at_return || "Not recorded"}</td>
                  <td style={notesCellStyle}>{loan.notes || "—"}</td>
                  <td style={notesCellStyle}>{loan.return_notes || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

const headerCellStyle = {
  textAlign: "left",
  padding: "0.7rem",
  borderBottom: "2px solid #ddd",
  color: "#444",
  whiteSpace: "nowrap",
};

const cellStyle = {
  padding: "0.7rem",
  borderBottom: "1px solid #eee",
  color: "#344054",
  verticalAlign: "top",
};

const notesCellStyle = {
  ...cellStyle,
  maxWidth: 280,
  whiteSpace: "pre-wrap",
  overflowWrap: "anywhere",
};

const toolLinkStyle = {
  color: "#175cd3",
  textDecoration: "none",
  fontWeight: 600,
};

const returnButtonStyle = {
  padding: "0.4rem 0.65rem",
  cursor: "pointer",
  border: "1px solid #b42318",
  borderRadius: 6,
  background: "#fff",
  color: "#b42318",
  fontWeight: 600,
  whiteSpace: "nowrap",
};
