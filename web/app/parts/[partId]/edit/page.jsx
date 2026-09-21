import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "../../../../components/Navbar";
import { updatePart } from "../../../actions/parts";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const API_BASE = process.env.API_BASE_URL || "http://192.168.50.37:8001";

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

const groupStyle = {
  marginBottom: "1rem",
};

async function fetchPart(partId) {
  const response = await fetch(`${API_BASE}/api/parts/${partId}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Could not load part ${partId}`);
  }

  return response.json();
}

function inputDate(value) {
  if (!value) {
    return "";
  }

  return String(value).slice(0, 10);
}

export default async function EditPartPage({ params }) {
  const partId = Number(params.partId);

  if (!Number.isInteger(partId) || partId < 1) {
    notFound();
  }

  const part = await fetchPart(partId);

  if (!part) {
    notFound();
  }

  const quantity = part.quantity ?? part.quantity_on_hand ?? 0;

  return (
    <div className="app-shell">
      <Navbar />

      <div className="app-content">
        <main
          style={{
            padding: "1.5rem",
            fontFamily: "system-ui, sans-serif",
            maxWidth: 760,
          }}
        >
          <Link
            href={`/parts/${partId}`}
            style={{
              display: "inline-block",
              marginBottom: "1rem",
              color: "#175cd3",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            ← Back to Part
          </Link>

          <h1 style={{ color: "#101828", margin: 0 }}>Edit Part</h1>

          <p style={{ color: "#667085", marginTop: "0.45rem" }}>
            Update inventory, cost, and storage information.
          </p>

          <form action={updatePart} style={{ marginTop: "1.5rem" }}>
            <input type="hidden" name="part_id" value={partId} />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "1rem",
              }}
            >
              <div style={groupStyle}>
                <label style={labelStyle}>Part Name</label>
                <input
                  name="name"
                  required
                  defaultValue={part.name || ""}
                  style={fieldStyle}
                />
              </div>

              <div style={groupStyle}>
                <label style={labelStyle}>Category</label>
                <input
                  name="category"
                  required
                  defaultValue={part.category || ""}
                  style={fieldStyle}
                />
              </div>

              <div style={groupStyle}>
                <label style={labelStyle}>Quantity on Hand</label>
                <input
                  name="quantity_on_hand"
                  type="number"
                  min="0"
                  defaultValue={quantity}
                  style={fieldStyle}
                />
              </div>

              <div style={groupStyle}>
                <label style={labelStyle}>Unit</label>
                <input
                  name="unit"
                  defaultValue={part.unit || ""}
                  placeholder="e.g. each, box, litre"
                  style={fieldStyle}
                />
              </div>

              <div style={groupStyle}>
                <label style={labelStyle}>Cost per Unit</label>
                <input
                  name="cost_per_unit"
                  type="number"
                  min="0"
                  step="0.01"
                  defaultValue={part.cost_per_unit ?? ""}
                  style={fieldStyle}
                />
              </div>

              <div style={groupStyle}>
                <label style={labelStyle}>Minimum Stock Level</label>
                <input
                  name="min_stock_level"
                  type="number"
                  min="0"
                  defaultValue={part.min_stock_level ?? ""}
                  style={fieldStyle}
                />
              </div>

              <div style={groupStyle}>
                <label style={labelStyle}>Storage Location</label>
                <input
                  name="location"
                  defaultValue={part.location || ""}
                  style={fieldStyle}
                />
              </div>

              <div style={groupStyle}>
                <label style={labelStyle}>Supplier</label>
                <input
                  name="supplier"
                  defaultValue={part.supplier || ""}
                  style={fieldStyle}
                />
              </div>

              <div style={groupStyle}>
                <label style={labelStyle}>Part Number</label>
                <input
                  name="part_number"
                  defaultValue={part.part_number || ""}
                  style={fieldStyle}
                />
              </div>
            </div>

            <div style={groupStyle}>
              <label style={labelStyle}>Notes</label>
              <textarea
                name="notes"
                rows="4"
                defaultValue={part.notes || ""}
                style={fieldStyle}
              />
            </div>

            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <button
                type="submit"
                style={{
                  padding: "0.6rem 1rem",
                  cursor: "pointer",
                  border: "1px solid #175cd3",
                  borderRadius: 6,
                  background: "#175cd3",
                  color: "#fff",
                  fontWeight: 700,
                }}
              >
                Save Changes
              </button>

              <Link href={`/parts/${partId}`} style={{ textDecoration: "none" }}>
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
        </main>
      </div>
    </div>
  );
}
