import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "../../../components/Navbar";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "Not recorded";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function getQuantity(part) {
  const quantity = Number(part.quantity ?? part.quantity_on_hand ?? 0);

  return Number.isFinite(quantity) ? quantity : 0;
}

function getCostPerUnit(part) {
  const cost = part.cost_per_unit;

  if (cost === null || cost === undefined || cost === "") {
    return null;
  }

  const amount = Number(cost);

  return Number.isFinite(amount) ? amount : null;
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

  const quantity = getQuantity(part);
  const costPerUnit = getCostPerUnit(part);
  const inventoryValue =
    costPerUnit === null ? null : quantity * costPerUnit;

  const partInfo = [
    ["Category", part.category],
    ["Part Number", part.part_number],
    ["Supplier", part.supplier],
    ["Brand", part.brand],
    ["Compatible With", part.model_compatibility],
    ["Quantity on Hand", quantity],
    ["Unit", part.unit],
    ["Storage Location", part.location],
    ["Minimum Stock Level", part.min_stock_level],
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
                  {part.category || "Uncategorized"}
                  {part.part_number ? ` · ${part.part_number}` : ""}
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
              <h2 style={sectionHeadingStyle}>Inventory Value</h2>

              <div style={infoGridStyle}>
                <InfoItem label="Quantity on Hand" value={quantity} />
                <InfoItem
                  label="Cost per Unit"
                  value={formatCurrency(costPerUnit)}
                />
                <InfoItem
                  label="Total Inventory Value"
                  value={formatCurrency(inventoryValue)}
                />
              </div>
            </section>

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

            {part.notes ? (
              <section style={{ marginTop: "1.5rem" }}>
                <h2 style={sectionHeadingStyle}>Notes</h2>

                <div style={notesPanelStyle}>{part.notes}</div>
              </section>
            ) : null}
          </section>
        </main>
      </div>
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
