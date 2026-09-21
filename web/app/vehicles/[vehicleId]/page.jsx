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

export default async function VehicleDetailPage({ params }) {
  const vehicleId = Number(params.vehicleId);

  if (!Number.isInteger(vehicleId) || vehicleId < 1) {
    notFound();
  }

  const vehicle = await fetchJson(`/api/vehicles/${vehicleId}`, true);

  if (!vehicle) {
    notFound();
  }

  const purchasePrice = Number(vehicle.purchase_price);
  const currentValue = Number(vehicle.current_value);
  const hasValueChange =
    vehicle.purchase_price !== null &&
    vehicle.purchase_price !== undefined &&
    vehicle.current_value !== null &&
    vehicle.current_value !== undefined;

  const valueChange = hasValueChange ? currentValue - purchasePrice : null;
  const valueChangePercent =
    hasValueChange && purchasePrice > 0
      ? (valueChange / purchasePrice) * 100
      : null;

  const vehicleInfo = [
    ["Type", vehicle.type],
    ["Make", vehicle.make],
    ["Model", vehicle.model],
    ["Year", vehicle.year],
    ["VIN", vehicle.vin],
    ["Color", vehicle.color],
    ["License Plate", vehicle.license_plate],
    ["Storage Location", vehicle.location],
    ["Condition", vehicle.condition_status],
    ["Purchase Date", vehicle.purchase_date ? formatDateOnly(vehicle.purchase_date) : null],
    ["Created", formatDate(vehicle.created_at)],
    ["Last Updated", vehicle.updated_at ? formatDate(vehicle.updated_at) : null],
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
          href="/vehicles"
          style={{
            display: "inline-block",
            marginBottom: "1rem",
            color: "#175cd3",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          ← Back to Vehicles
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
              <h1 style={{ margin: 0, color: "#101828" }}>{vehicle.name}</h1>

              <p style={{ margin: "0.45rem 0 0", color: "#667085" }}>
                {[vehicle.type, vehicle.make, vehicle.model].filter(Boolean).join(" · ")}
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
              <Link href={`/vehicles/${vehicle.id}/edit`} style={{ textDecoration: "none" }}>
                <button type="button" style={editButtonStyle}>
                  Edit Vehicle
                </button>
              </Link>

              <Link href={`/vehicles/${vehicle.id}/remove`} style={{ textDecoration: "none" }}>
                <button type="button" style={removeButtonStyle}>
                  Remove Vehicle
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
                Vehicle
              </span>
            </div>
          </div>

          <section style={{ marginTop: "1.5rem" }}>
            <h2 style={sectionHeadingStyle}>Identification and Storage</h2>

            <div style={infoGridStyle}>
              {vehicleInfo
                .filter(([, value]) => value !== null && value !== undefined && value !== "")
                .map(([label, value]) => (
                  <InfoItem key={label} label={label} value={value} />
                ))}
            </div>
          </section>

          <section style={{ marginTop: "1.5rem" }}>
            <h2 style={sectionHeadingStyle}>Purchase and Value</h2>

            <div style={infoGridStyle}>
              <InfoItem label="Purchase Price" value={formatCurrency(vehicle.purchase_price)} />
              <InfoItem label="Current Value" value={formatCurrency(vehicle.current_value)} />

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

          {vehicle.notes ? (
            <section style={{ marginTop: "1.5rem" }}>
              <h2 style={sectionHeadingStyle}>Notes</h2>

              <div style={notesPanelStyle}>
                {vehicle.notes}
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
