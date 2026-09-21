import { Navbar } from "../../../components/Navbar";
import { createTool } from "../../actions/tools";

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

export default function NewToolPage() {
  return (
    <div>
      <Navbar />

      <main
        style={{
          padding: "1.5rem",
          fontFamily: "system-ui, sans-serif",
          maxWidth: 760,
        }}
      >
        <h1>Add Tool</h1>
        <p style={{ color: "#555" }}>
          Record the tool’s identification, value, condition, and storage location.
        </p>

        <form action={createTool} style={{ marginTop: "1.5rem" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1rem",
            }}
          >
            <div style={groupStyle}>
              <label style={labelStyle}>Tool Name</label>
              <input name="name" required style={fieldStyle} />
            </div>

            <div style={groupStyle}>
              <label style={labelStyle}>Category</label>
              <input
                name="category"
                required
                placeholder="e.g. Power Tools, Hand Tools"
                style={fieldStyle}
              />
            </div>

            <div style={groupStyle}>
              <label style={labelStyle}>Brand</label>
              <input name="brand" placeholder="e.g. Milwaukee" style={fieldStyle} />
            </div>

            <div style={groupStyle}>
              <label style={labelStyle}>Model</label>
              <input name="model" style={fieldStyle} />
            </div>

            <div style={groupStyle}>
              <label style={labelStyle}>Serial Number</label>
              <input name="serial_number" style={fieldStyle} />
            </div>

            <div style={groupStyle}>
              <label style={labelStyle}>Storage Location</label>
              <input
                name="location"
                placeholder="e.g. Garage workbench"
                style={fieldStyle}
              />
            </div>

            <div style={groupStyle}>
              <label style={labelStyle}>Purchase Date</label>
              <input name="purchase_date" type="date" style={fieldStyle} />
            </div>

            <div style={groupStyle}>
              <label style={labelStyle}>Purchase Price</label>
              <input
                name="purchase_price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
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
                placeholder="0.00"
                style={fieldStyle}
              />
            </div>

            <div style={groupStyle}>
              <label style={labelStyle}>Condition</label>
              <select name="condition_status" defaultValue="good" style={fieldStyle}>
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
              rows="4"
              placeholder="Accessories, special instructions, warranty details, etc."
              style={fieldStyle}
            />
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
            Save Tool
          </button>
        </form>
      </main>
    </div>
  );
}
