import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "../../../components/Navbar";

const API_BASE = process.env.API_BASE_URL || "http://localhost:8001";

async function fetchJson(path, allowNotFound = false) {
  const response = await fetch(`${API_BASE}${path}`, {
    cache: "no-store",
  });

  if (allowNotFound && response.status === 404) {
    return null;
  }

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

function formatDateOnly(value) {
  if (!value) return "Not recorded";

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(`${value}T12:00:00`));
}

function formatCurrency(value) {
  if (value === null || value === undefined || value === "") {
    return "Not recorded";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value));
}

function statusForLoan(loan) {
  if (!loan) {
    return {
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
    label: overdue ? "Overdue" : "Loaned out",
    color: overdue ? "#b42318" : "#9a6700",
    background: overdue ? "#fef3f2" : "#fffaeb",
    border: overdue ? "#fecdca" : "#fedf89",
  };
}

export default async function ToolDetailPage({ params }) {
  const toolId = Number(params.toolId);

  if (!Number.isInteger(toolId) || toolId < 1) {
    notFound();
  }

  const [tool, allLoans] = await Promise.all([
    fetchJson(`/api/tools/${toolId}`, true),
    fetchJson("/api/loans/"),
  ]);

  if (!tool) {
    notFound();
  }

  const toolLoans = allLoans
    .filter((loan) => loan.tool_id === tool.id)
    .sort((a, b) => new Date(b.checkout_date) - new Date(a.checkout_date));

  const activeLoan = toolLoans.find((loan) => !loan.return_date);
  const status = statusForLoan(activeLoan);

  const purchasePrice = Number(tool.purchase_price);
  const currentValue = Number(tool.current_value);
  const hasValueChange =
    tool.purchase_price !== null &&
    tool.purchase_price !== undefined &&
    tool.current_value !== null &&
    tool.current_value !== undefined;

  const valueChange = hasValueChange ? currentValue - purchasePrice : null;
  const valueChangePercent =
    hasValueChange && purchasePrice > 0
      ? (valueChange / purchasePrice) * 100
      : null;

  const toolInfo = [
    ["Category", tool.category],
    ["Brand", tool.brand],
    ["Model", tool.model],
    ["Serial Number", tool.serial_number],
    ["Storage Location", tool.location],
    ["Condition", tool.condition_status],
    ["Purchase Date", tool.purchase_date ? formatDateOnly(tool.purchase_date) : null],
    ["Created", formatDate(tool.created_at)],
    ["Last Updated", tool.updated_at ? formatDate(tool.updated_at) : null],
  ];

  return (
    <div>
      <Navbar />

      <main
        style={{
          padding: "1.5rem",
          fontFamily: "system-ui, sans-serif",
          maxWidth: 1080,
          margin: "0 auto",
        }}
      >
        <Link
          href="/tools"
          style={{
            display: "inline-block",
            marginBottom: "1rem",
            color: "#175cd3",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          ← Back to Tools
        </Link>

        <section
          style={{
            border: "1px solid #d0d5dd",
            borderRadius: 10,
            background: "#fff",
            padding: "1.25rem",
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
              <h1 style={{ margin: 0, color: "#101828" }}>{tool.name}</h1>

              <p style={{ margin: "0.45rem 0 0", color: "#667085" }}>
                {tool.category}
                {tool.brand || tool.model
                  ? ` · ${[tool.brand, tool.model].filter(Boolean).join(" ")}`
                  : ""}
              </p>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.65rem",
                flexWrap: "wrap",
              }}
            >
              <Link href={`/tools/${tool.id}/edit`} style={{ textDecoration: "none" }}>
                <button type="button" style={editButtonStyle}>
                  Edit Tool
                </button>
              </Link>

              <Link href={`/tools/${tool.id}/remove`} style={{ textDecoration: "none" }}>
                <button type="button" style={removeButtonStyle}>
                  Remove Tool
                </button>
              </Link>

              <span
                style={{
                  border: `1px solid ${status.border}`,
                  borderRadius: 999,
                  padding: "0.35rem 0.7rem",
                  background: status.background,
                  color: status.color,
                  fontSize: "0.85rem",
                  fontWeight: 700,
                }}
              >
                {status.label}
              </span>
            </div>
          </div>

          {activeLoan ? (
            <section
              style={{
                marginTop: "1.25rem",
                padding: "1rem",
                borderRadius: 8,
                background: status.background,
                border: `1px solid ${status.border}`,
              }}
            >
              <h2 style={{ margin: 0, fontSize: "1rem", color: status.color }}>
                Current Loan
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
                  gap: "0.8rem",
                  marginTop: "0.8rem",
                }}
              >
                <InfoItem label="Borrower" value={activeLoan.borrower_name} />
                <InfoItem label="Checked Out" value={formatDate(activeLoan.checkout_date)} />
                <InfoItem label="Return ETA" value={formatDate(activeLoan.due_date)} />
                <InfoItem
                  label="Checkout Condition"
                  value={activeLoan.condition_at_checkout || "Not recorded"}
                />
              </div>

              {activeLoan.notes ? (
                <div
                  style={{
                    marginTop: "0.8rem",
                    paddingTop: "0.8rem",
                    borderTop: `1px solid ${status.border}`,
                    color: "#475467",
                    fontSize: "0.9rem",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  <strong>Checkout Notes:</strong> {activeLoan.notes}
                </div>
              ) : null}

              <Link
                href={`/loans/${activeLoan.id}/return`}
                style={{
                  display: "inline-block",
                  marginTop: "1rem",
                  textDecoration: "none",
                }}
              >
                <button type="button" style={returnButtonStyle}>
                  Return Tool
                </button>
              </Link>
            </section>
          ) : (
            <section style={availablePanelStyle}>
              This tool is currently available.
            </section>
          )}

          <section style={{ marginTop: "1.5rem" }}>
            <h2 style={sectionHeadingStyle}>Identification and Storage</h2>

            <div style={infoGridStyle}>
              {toolInfo
                .filter(([, value]) => value !== null && value !== undefined && value !== "")
                .map(([label, value]) => (
                  <InfoItem key={label} label={label} value={value} />
                ))}
            </div>
          </section>

          <section style={{ marginTop: "1.5rem" }}>
            <h2 style={sectionHeadingStyle}>Purchase and Value</h2>

            <div style={infoGridStyle}>
              <InfoItem label="Purchase Price" value={formatCurrency(tool.purchase_price)} />
              <InfoItem label="Current Value" value={formatCurrency(tool.current_value)} />

              {hasValueChange ? (
                <InfoItem
                  label="Value Change"
                  value={
                    <span style={{ color: valueChange >= 0 ? "#067647" : "#b42318" }}>
                      {valueChange >= 0 ? "+" : ""}
                      {formatCurrency(valueChange)}
                      {valueChangePercent !== null
                        ? ` (${valueChangePercent >= 0 ? "+" : ""}${valueChangePercent.toFixed(1)}%)`
                        : ""}
                    </span>
                  }
                />
              ) : null}
            </div>
          </section>

          {tool.notes ? (
            <section style={{ marginTop: "1.5rem" }}>
              <h2 style={sectionHeadingStyle}>Notes</h2>

              <div style={notesPanelStyle}>
                {tool.notes}
              </div>
            </section>
          ) : null}

          <section style={{ marginTop: "1.5rem" }}>
            <h2 style={sectionHeadingStyle}>Loan History</h2>

            {toolLoans.length === 0 ? (
              <p style={{ color: "#667085" }}>This tool has not been loaned out yet.</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1250 }}>
                  <thead>
                    <tr>
                      {[
                        "Borrower",
                        "Checked Out",
                        "Return ETA",
                        "Returned",
                        "Checkout Condition",
                        "Return Condition",
                        "Checkout Notes",
                        "Return Notes",
                      ].map((heading) => (
                        <th key={heading} style={headerCellStyle}>
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {toolLoans.map((loan) => (
                      <tr key={loan.id}>
                        <td style={cellStyle}>{loan.borrower_name}</td>
                        <td style={cellStyle}>{formatDate(loan.checkout_date)}</td>
                        <td style={cellStyle}>{formatDate(loan.due_date)}</td>
                        <td style={cellStyle}>{formatDate(loan.return_date)}</td>
                        <td style={cellStyle}>{loan.condition_at_checkout || "—"}</td>
                        <td style={cellStyle}>{loan.condition_at_return || "—"}</td>
                        <td style={notesCellStyle}>{loan.notes || "—"}</td>
                        <td style={notesCellStyle}>{loan.return_notes || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </section>
      </main>
    </div>
  );
}

const editButtonStyle = {
  padding: "0.45rem 0.75rem",
  cursor: "pointer",
  border: "1px solid #98a2b3",
  borderRadius: 6,
  background: "#fff",
  color: "#344054",
  fontWeight: 600,
};

const removeButtonStyle = {
  padding: "0.45rem 0.75rem",
  cursor: "pointer",
  border: "1px solid #b42318",
  borderRadius: 6,
  background: "#fff",
  color: "#b42318",
  fontWeight: 600,
};

const returnButtonStyle = {
  padding: "0.55rem 0.9rem",
  cursor: "pointer",
  border: "1px solid #b42318",
  borderRadius: 6,
  background: "#fff",
  color: "#b42318",
  fontWeight: 700,
};

const availablePanelStyle = {
  marginTop: "1.25rem",
  padding: "1rem",
  borderRadius: 8,
  background: "#ecfdf3",
  border: "1px solid #abefc6",
  color: "#067647",
  fontWeight: 600,
};

const sectionHeadingStyle = {
  color: "#101828",
  marginBottom: "0.8rem",
};

const infoGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "0.8rem",
};

const notesPanelStyle = {
  padding: "1rem",
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: 8,
  whiteSpace: "pre-wrap",
  color: "#344054",
};

const headerCellStyle = {
  textAlign: "left",
  padding: "0.7rem",
  borderBottom: "2px solid #d0d5dd",
  color: "#475467",
  fontSize: "0.85rem",
  whiteSpace: "nowrap",
};

const cellStyle = {
  padding: "0.7rem",
  borderBottom: "1px solid #eaecf0",
  color: "#344054",
  verticalAlign: "top",
  fontSize: "0.9rem",
};

const notesCellStyle = {
  ...cellStyle,
  maxWidth: 260,
  whiteSpace: "pre-wrap",
  overflowWrap: "anywhere",
};

function InfoItem({ label, value }) {
  return (
    <div
      style={{
        padding: "0.8rem",
        border: "1px solid #eaecf0",
        borderRadius: 7,
        background: "#fcfcfd",
      }}
    >
      <div style={{ color: "#667085", fontSize: "0.8rem" }}>{label}</div>

      <div
        style={{
          marginTop: "0.25rem",
          color: "#101828",
          fontWeight: 600,
          overflowWrap: "anywhere",
        }}
      >
        {value}
      </div>
    </div>
  );
}
