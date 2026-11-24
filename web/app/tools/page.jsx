import Link from "next/link";
import { Navbar } from "../../components/Navbar";

const API_BASE = process.env.API_BASE_URL || "http://localhost:8001";

async function fetchJson(path) {
  const response = await fetch(`${API_BASE}${path}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Could not load ${path}`);
  }

  return response.json();
}

function formatDate(value) {
  if (!value) return "Not recorded";

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getStatus(tool, activeLoansByTool) {
  const loan = activeLoansByTool.get(tool.id);

  if (!loan) {
    return {
      loan: null,
      label: "Available",
      color: "#067647",
      background: "#ecfdf3",
      border: "#abefc6",
    };
  }

  const overdue =
    loan.due_date &&
    new Date(loan.due_date).getTime() < Date.now();

  return {
    loan,
    label: overdue ? "Overdue" : "Loaned out",
    color: overdue ? "#b42318" : "#9a6700",
    background: overdue ? "#fef3f2" : "#fffaeb",
    border: overdue ? "#fecdca" : "#fedf89",
  };
}

export default async function ToolsPage() {
  const [tools, loans] = await Promise.all([
    fetchJson("/api/tools/"),
    fetchJson("/api/loans/"),
  ]);

  const activeLoansByTool = new Map(
    loans
      .filter((loan) => !loan.return_date)
      .map((loan) => [loan.tool_id, loan])
  );

  const availableCount = tools.filter(
    (tool) => !activeLoansByTool.has(tool.id)
  ).length;

  const loanedCount = tools.length - availableCount;

  return (
    <div>
      <Navbar />

      <main
        style={{
          padding: "1.5rem",
          fontFamily: "system-ui, sans-serif",
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1 style={{ margin: 0 }}>Tools</h1>
            <p style={{ margin: "0.45rem 0 0", color: "#667085" }}>
              Track location, condition, and tool checkout status.
            </p>
          </div>

          <Link href="/tools/new" style={{ textDecoration: "none" }}>
            <button style={primaryButtonStyle}>Add Tool</button>
          </Link>
        </div>

        <section style={summaryGridStyle}>
          <SummaryCard label="Total Tools" value={tools.length} color="#175cd3" />
          <SummaryCard label="Available" value={availableCount} color="#067647" />
          <SummaryCard label="Loaned Out" value={loanedCount} color="#9a6700" />
        </section>

        {tools.length === 0 ? (
          <section style={emptyStateStyle}>
            <p style={{ marginTop: 0 }}>No tools have been added yet.</p>
            <Link href="/tools/new">Add your first tool</Link>
          </section>
        ) : (
          <section style={toolGridStyle}>
            {tools.map((tool) => {
              const status = getStatus(tool, activeLoansByTool);
              const details = [tool.brand, tool.model].filter(Boolean).join(" ");

              return (
                <article key={tool.id} style={toolCardStyle}>
                  <Link
                    href={`/tools/${tool.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div style={{ cursor: "pointer" }}>
                      <div style={cardHeaderStyle}>
                        <div>
                          <h2 style={toolNameStyle}>{tool.name}</h2>
                          <p style={toolSubtitleStyle}>
                            {tool.category}
                            {details ? ` · ${details}` : ""}
                          </p>
                        </div>

                        <StatusBadge status={status} />
                      </div>

                      <div style={detailGridStyle}>
                        <Detail label="Location" value={tool.location || "Not recorded"} />
                        <Detail label="Condition" value={tool.condition_status || "Not recorded"} />
                        <Detail label="Serial" value={tool.serial_number || "Not recorded"} />
                      </div>

                      {status.loan ? (
                        <div
                          style={{
                            ...loanPanelStyle,
                            background: status.background,
                            border: `1px solid ${status.border}`,
                          }}
                        >
                          <div style={{ color: status.color, fontWeight: 700, fontSize: "0.9rem" }}>
                            Checked out to {status.loan.borrower_name}
                          </div>
                          <div style={{ marginTop: "0.3rem", color: "#475467", fontSize: "0.86rem" }}>
                            {status.loan.due_date
                              ? `Return ETA: ${formatDate(status.loan.due_date)}`
                              : "No return ETA recorded"}
                          </div>
                        </div>
                      ) : (
                        <div style={availablePanelStyle}>View all details →</div>
                      )}
                    </div>
                  </Link>

                  {status.loan ? (
                    <Link
                      href={`/loans/${status.loan.id}/return`}
                      style={{ display: "block", marginTop: "0.75rem", textDecoration: "none" }}
                    >
                      <button type="button" style={returnButtonStyle}>
                        Return Tool
                      </button>
                    </Link>
                  ) : null}
                </article>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
}

function SummaryCard({ label, value, color }) {
  return (
    <div style={summaryCardStyle}>
      <div style={{ color: "#667085", fontSize: "0.88rem" }}>{label}</div>
      <div style={{ color, fontSize: "1.65rem", fontWeight: 750, marginTop: "0.25rem" }}>
        {value}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      style={{
        flexShrink: 0,
        border: `1px solid ${status.border}`,
        borderRadius: 999,
        padding: "0.22rem 0.55rem",
        background: status.background,
        color: status.color,
        fontSize: "0.78rem",
        fontWeight: 700,
      }}
    >
      {status.label}
    </span>
  );
}

function Detail({ label, value }) {
  return (
    <>
      <div style={{ color: "#667085" }}>{label}</div>
      <div style={{ color: "#344054", overflowWrap: "anywhere" }}>{value}</div>
    </>
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

const returnButtonStyle = {
  width: "100%",
  padding: "0.55rem 0.8rem",
  cursor: "pointer",
  border: "1px solid #b42318",
  borderRadius: 6,
  background: "#fff",
  color: "#b42318",
  fontWeight: 700,
};

const summaryGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "1rem",
  marginTop: "1.5rem",
};

const summaryCardStyle = {
  border: "1px solid #d0d5dd",
  borderRadius: 8,
  padding: "1rem",
  background: "#fff",
};

const emptyStateStyle = {
  marginTop: "1.5rem",
  border: "1px dashed #cbd5e1",
  borderRadius: 8,
  padding: "2rem",
  textAlign: "center",
  color: "#667085",
};

const toolGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "1rem",
  marginTop: "1.5rem",
};

const toolCardStyle = {
  height: "100%",
  boxSizing: "border-box",
  border: "1px solid #d0d5dd",
  borderRadius: 10,
  background: "#fff",
  padding: "1rem",
  boxShadow: "0 1px 2px rgba(16, 24, 40, 0.05)",
};

const cardHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "0.75rem",
};

const toolNameStyle = {
  margin: 0,
  fontSize: "1.1rem",
  color: "#101828",
};

const toolSubtitleStyle = {
  margin: "0.35rem 0 0",
  color: "#667085",
  fontSize: "0.9rem",
};

const detailGridStyle = {
  display: "grid",
  gridTemplateColumns: "100px 1fr",
  gap: "0.5rem 0.75rem",
  marginTop: "1rem",
  fontSize: "0.9rem",
};

const loanPanelStyle = {
  marginTop: "1rem",
  padding: "0.8rem",
  borderRadius: 6,
};

const availablePanelStyle = {
  marginTop: "1rem",
  color: "#175cd3",
  fontSize: "0.86rem",
  fontWeight: 600,
};
