import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "../../../components/Navbar";

const API_BASE = process.env.API_BASE_URL || "http://192.168.50.37:8001";

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

export default async function PartDetailPage({ params }) {
  const partId = Number(params.partId);

  if (!Number.isInteger(partId) || partId < 1) {
    notFound();
  }

  const part = await fetchJson(`/api/parts/${partId}`, true);

  if (!part) {
    notFound();
  }

  const purchasePrice = Number(part.purchase_price);
  const currentValue = Number(part.current_value);
  const hasValueChange =
    part.purchase_price !== null &&
    part.purchase_price !== undefined &&
    part.current_value !== null &&
    part.current_value !== undefined;

  const valueChange = hasValueChange ? currentValue - purchasePrice : null;
  const valueChangePercent =
    hasValueChange && purchasePrice > 0
      ? (valueChange / purchasePrice) * 100
      : null;

  const partInfo = [
    ["Category", part.category],
    ["Part Number", part.part_number],
    ["Brand", part.brand],
    ["Compatible With", part.model_compatibility],
    ["Quantity on Hand", part.quantity_on_hand ?? "Not recorded"],
    ["Storage Location", part.location],
    ["Condition", part.condition_status],
    ["Purchase Date", part.purchase_date ? formatDateOnly(part.purchase_date) : null],
    ["Created", formatDate(part.created_at)],
    ["Last Updated", part.updated_at ? formatDate(part.updated_at) : null],
  ];

  return (
    <div className="app-shell">
      <Navbar />
      <div className="app-content">

      <main
        style={{
          padding: "1.5rem",
          fontFamily: "system-ui, sans-serif",
          maxWidth: 1080,
          margin: "0 auto",
        }}
      >
        <Link
          href="/parts"
          style={{
            display: "inline-block",
            marginBottom: "1rem",
            color: "#175cd3",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          ← Back to Parts
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
              <h1 style={{ margin: 0, color: "#101828" }}>{part.name}</h1>

              <p style={{ margin: "0.45rem 0 0", color: "#667085" }}>
                {part.category}
                {part.brand || part.model_compatibility
                  ? ` · ${[part.brand, part.model_compatibility].filter(Boolean).join(" ")}`
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
              <Link href={`/parts/${part.id}/edit`} style={{ textDecoration: "none" }}>
                <button type="button" style={editButtonStyle}>
                  Edit Part
                </button>
              </Link>

              <Link href={`/parts/${part.id}/remove`} style={{ textDecoration: "none" }}>
                <button type="button" style={removeButtonStyle}>
                  Remove Part
                </button>
              </Link>

              <span
                style={{
                  border: "1px solid #d0d5dd",
                  borderRadius: 999,
                  padding: "0.35rem 0.7rem",
                  background: "#f2f4f7",
                  color: "#344054",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                }}
              >
                Part
              </span>
            </div>
          </div>

          <section style={{ marginTop: "1.5rem" }}>
            <h2 style={sectionHeadingStyle}>Identification and Storage</h2>

            <div style={infoGridStyle}>
              {partInfo
                .filter(([, value]) => value !== null && value !== undefined && value !== "")
                .map(([label, value]) => (
                  <InfoItem key={label} label={label} value={value} />
                ))}
            </div>
          </section>

          <section style={{ marginTop: "1.5rem" }}>
            <h2 style={sectionHeadingStyle}>Purchase and Value</h2>

            <div style={infoGridStyle}>
              <InfoItem label="Purchase Price" value={formatCurrency(part.purchase_price)} />
              <InfoItem label="Current Value" value={formatCurrency(part.current_value)} />

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

          {part.notes ? (
            <section style={{ marginTop: "1.5rem" }}>
              <h2 style={sectionHeadingStyle}>Notes</h2>

              <div style={notesPanelStyle}>
                {part.notes}
              </div>
            </section>
          ) : null}
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
