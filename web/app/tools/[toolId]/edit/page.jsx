import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "../../../../components/Navbar";
import { updateTool } from "../../../actions/tools";

const API_BASE = process.env.API_BASE_URL || "http://localhost:8001";

async function getTool(toolId) {
  const response = await fetch(`${API_BASE}/api/tools/${toolId}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Could not load tool.");
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

const labelStyle = {
  display: "block",
  marginBottom: "0.35rem",
  fontWeight: 600,
  color: "#344054",
};

const groupStyle = {
  marginBottom: "1rem",
};

export default async function EditToolPage({ params }) {
  const toolId = Number(params.toolId);

  if (!Number.isInteger(toolId) || toolId < 1) {
    notFound();
  }

  const tool = await getTool(toolId);

  if (!tool) {
    notFound();
  }

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
          href={`/tools/${tool.id}`}
          style={{
            display: "inline-block",
            marginBottom: "1rem",
            color: "#175cd3",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          ← Back to {tool.name}
        </Link>

        <h1 style={{ marginBottom: "0.35rem" }}>Edit Tool</h1>
        <p style={{ marginTop: 0, color: "#667085" }}>
          Update identification, storage, condition, and value details.
        </p>

        <form action={updateTool} style={{ marginTop: "1.5rem" }}>
          <input type="hidden" name="tool_id" value={tool.id} />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1rem",
            }}
          >
            <div style={groupStyle}>
              <label style={labelStyle}>Tool Name</label>
              <input name="name" required defaultValue={tool.name || ""} style={fieldStyle} />
            </div>

            <div style={groupStyle}>
              <label style={labelStyle}>Category</label>
              <input name="category" required defaultValue={tool.category || ""} style={fieldStyle} />
            </div>

            <div style={groupStyle}>
              <label style={labelStyle}>Brand</label>
              <input name="brand" defaultValue={tool.brand || ""} style={fieldStyle} />
            </div>

            <div style={groupStyle}>
              <label style={labelStyle}>Model</label>
              <input name="model" defaultValue={tool.model || ""} style={fieldStyle} />
            </div>

            <div style={groupStyle}>
              <label style={labelStyle}>Serial Number</label>
              <input name="serial_number" defaultValue={tool.serial_number || ""} style={fieldStyle} />
            </div>

            <div style={groupStyle}>
              <label style={labelStyle}>Storage Location</label>
              <input name="location" defaultValue={tool.location || ""} style={fieldStyle} />
            </div>

            <div style={groupStyle}>
              <label style={labelStyle}>Purchase Date</label>
              <input name="purchase_date" type="date" defaultValue={tool.purchase_date || ""} style={fieldStyle} />
            </div>

            <div style={groupStyle}>
              <label style={labelStyle}>Purchase Price</label>
              <input
                name="purchase_price"
                type="number"
                min="0"
                step="0.01"
                defaultValue={tool.purchase_price ?? ""}
                style={fieldStyle}
              />
            </div>

            <div style={groupStyle}>
              <label style={labelStyle}>Current Value</label>
              <input
                name="current_value"
                type="number"
                min="0"
                step="0.01"
                defaultValue={tool.current_value ?? ""}
                style={fieldStyle}
              />
            </div>

            <div style={groupStyle}>
              <label style={labelStyle}>Condition</label>
              <select
                name="condition_status"
                defaultValue={tool.condition_status || "good"}
                style={fieldStyle}
              >
                <option value="new">New</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="needs repair">Needs repair</option>
              </select>
            </div>
          </div>

          <div style={groupStyle}>
            <label style={labelStyle}>Notes</label>
            <textarea
              name="notes"
              rows="5"
              defaultValue={tool.notes || ""}
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
                fontWeight: 600,
              }}
            >
              Save Changes
            </button>

            <Link href={`/tools/${tool.id}`} style={{ textDecoration: "none" }}>
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
