import { Navbar } from "../../../components/Navbar";
import { createVehicle } from "../../actions/vehicles";

export default function NewVehiclePage() {
  return (
    <div className="app-shell">
      <Navbar />
      <div className="app-content">
      <main style={{ padding: "1.5rem", fontFamily: "system-ui, sans-serif" }}>
        <h1>Add Vehicle</h1>

        <form action={createVehicle} style={{ maxWidth: 420, marginTop: "1.5rem" }}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.25rem" }}>Name</label>
            <input name="name" required style={{ width: "100%", padding: "0.5rem" }} />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.25rem" }}>Type</label>
            <input name="type" required style={{ width: "100%", padding: "0.5rem" }} />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.25rem" }}>Make</label>
            <input name="make" required style={{ width: "100%", padding: "0.5rem" }} />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.25rem" }}>Model</label>
            <input name="model" required style={{ width: "100%", padding: "0.5rem" }} />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.25rem" }}>Year</label>
            <input name="year" type="number" required style={{ width: "100%", padding: "0.5rem" }} />
          </div>

          <button type="submit" style={{ padding: "0.5rem 1rem" }}>
            Save Vehicle
          </button>
        </form>
      </main>
    </div>
  );
}
