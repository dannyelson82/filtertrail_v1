import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "../../../../components/Navbar";
import { retireTool } from "../../../actions/retirements";

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
  border: "1px solid #98a2b3",
  borderRadius: 6,
  boxSizing: "border-box",
  fontFamily: "inherit",
};

export default async function RemoveToolPage({ params }) {
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
          maxWidth: 680,
          margin: "0 auto",
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
          ← Cancel and go back
        </Link>

        <section
          style={{
            border: "1px solid #fecdca",
            borderRadius: 10,
            background: "#fff",
            padding: "1.25rem",
          }}
        >
          <h1 style={{ margin: 0, color: "#b42318" }}>Remove Tool</h1>

          <p style={{ margin: "0.5rem 0 0", color: "#667085" }}>
            This retires the tool from the active list. Its record and loan history
            are kept for reference.
          </p>

          <div
            style={{
              marginTop: "1.25rem",
              padding: "1rem",
              background: "#fef3f2",
              border: "1px solid #fecdca",
              borderRadius: 8,
            }}
          >
            <div style={{ color: "#667085", fontSize: "0.82rem" }}>Tool to retire</div>
            <div style={{ marginTop: "0.2rem", color: "#101828", fontWeight: 700 }}>
              {tool.name}
            </div>
            <div style={{ marginTop: "0.2rem", color: "#475467" }}>
              {tool.category}
              {tool.brand || tool.model
                ? ` · ${[tool.brand, tool.model].filter(Boolean).join(" ")}`
                : ""}
            </div>
          </div>

          <form action={retireTool} style={{ marginTop: "1.5rem" }}>
            <input type="hidden" name="tool_id" value={tool.id} />

            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle}>Removal Reason</label>
              <select name="retirement_reason" required defaultValue="" style={fieldStyle}>
                <option value="" disabled>Select a reason</option>
                <option value="worn out">Worn out</option>
                <option value="sold">Sold</option>
                <option value="destroyed">Destroyed</option>
                <option value="lost">Lost</option>
                <option value="stolen">Stolen</option>
                <option value="donated">Donated</option>
                <option value="replaced">Replaced</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle}>Removal Notes</label>
              <textarea
                name="retirement_notes"
                rows="5"
                placeholder="Optional: sale price, replacement details, incident details, or other context."
                style={fieldStyle}
              />
            </div>

            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <button
                type="submit"
                style={{
                  padding: "0.6rem 1rem",
                  cursor: "pointer",
                  border: "1px solid #b42318",
                  borderRadius: 6,
                  background: "#b42318",
                  color: "#fff",
                  fontWeight: 700,
                }}
              >
                Retire Tool
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
        </section>
      </main>
    </div>
  </div>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: "0.35rem",
  fontWeight: 600,
  color: "#344054",
};
