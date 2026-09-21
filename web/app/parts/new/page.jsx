import { Navbar } from "../../../components/Navbar";
import { createPart } from "../../actions/parts";

const fieldStyle = {
  width: "100%",
  padding: "0.55rem",
  border: "1px solid #ccc",
  borderRadius: 4,
  boxSizing: "border-box",
};

const groupStyle = {
  marginBottom: "1rem",
};

const labelStyle = {
  display: "block",
  marginBottom: "0.35rem",
  fontWeight: 600,
};

export default function NewPartPage() {
  return (
    <div className="app-shell">
      <Navbar />

      <div className="app-content">
        <main
          style={{
            padding: "1.5rem",
            fontFamily: "system-ui, sans-serif",
            maxWidth: 720,
          }}
        >
          <h1>Add Part</h1>

          <p style={{ color: "#555" }}>
            Track inventory, storage location, and reorder levels.
          </p>

          <form action={createPart} style={{ marginTop: "1.5rem" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "1rem",
              }}
            >
              <div style={groupStyle}>
                <label style={labelStyle}>Part Name</label>
                <input name="name" required style={fieldStyle} />
              </div>

              <div style={groupStyle}>
                <label style={labelStyle}>Category</label>
                <input
                  name="category"
                  required
                  placeholder="e.g. Electrical, Engine, Hardware"
                  style={fieldStyle}
                />
              </div>

              <div style={groupStyle}>
                <label style={labelStyle}>Quantity on Hand</label>
                <input
                  name="quantity_on_hand"
                  type="number"
                  min="0"
                  defaultValue="0"
                  style={fieldStyle}
                />
              </div>

              <div style={groupStyle}>
                <label style={labelStyle}>Unit</label>
                <input
                  name="unit"
                  placeholder="e.g. each, box, litre"
                  style={fieldStyle}
                />
              </div>

              <div style={groupStyle}>
                <label style={labelStyle}>Storage Location</label>
                <input
                  name="location"
                  placeholder="e.g. Garage shelf A2"
                  style={fieldStyle}
                />
              </div>

              <div style={groupStyle}>
                <label style={labelStyle}>Minimum Stock Level</label>
                <input
                  name="min_stock_level"
                  type="number"
                  min="0"
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
                  style={fieldStyle}
                />
              </div>

              <div style={groupStyle}>
                <label style={labelStyle}>Supplier</label>
                <input name="supplier" style={fieldStyle} />
              </div>

              <div style={groupStyle}>
                <label style={labelStyle}>Part Number</label>
                <input name="part_number" style={fieldStyle} />
              </div>
            </div>

            <div style={groupStyle}>
              <label style={labelStyle}>Notes</label>
              <textarea name="notes" rows="4" style={fieldStyle} />
            </div>

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
              Save Part
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
