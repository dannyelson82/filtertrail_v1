import Link from "next/link";
import { notFound } from "next/navigation";
import { retireVehicle } from "../../../actions/retireVehicle";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.50.37:8001";

async function getVehicle(vehicleId) {
  const response = await fetch(`${API_BASE}/api/vehicles/${vehicleId}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Could not load vehicle.");
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

const labelStyle = {
  display: "block",
  marginBottom: "0.35rem",
  fontWeight: 600,
  color: "#344054",
};

export default async function RemoveVehiclePage({ params }) {
  const vehicleId = Number(params.vehicleId);

  if (!Number.isInteger(vehicleId) || vehicleId < 1) {
    notFound();
  }

  const vehicle = await getVehicle(vehicleId);

  if (!vehicle) {
    notFound();
  }

  return (
    <div>

      <main
        style={{
          padding: "1.5rem",
          fontFamily: "system-ui, sans-serif",
          maxWidth: 680,
          margin: "0 auto",
        }}
      >
        <Link
          href={`/vehicles/${vehicle.id}`}
          style={{
            display: "inline-block",
            marginBottom: "1rem",
            color: "#175cd3",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Cancel and go back
        </Link>

        <section
          style={{
            border: "1px solid #fecdca",
            borderRadius: 10,
            background: "#fff",
            padding: "1.25rem",
          }}
        >
          <h1 style={{ margin: 0, color: "#b42318" }}>
            Remove Vehicle
          </h1>

          <p style={{ margin: "0.5rem 0 0", color: "#667085" }}>
            This retires the vehicle from the active list. Its record is kept
            for reference.
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
            <div style={{ color: "#667085", fontSize: "0.82rem" }}>
              Vehicle to remove
            </div>

            <div
              style={{
                marginTop: "0.2rem",
                color: "#101828",
                fontWeight: 700,
              }}
            >
              {vehicle.name}
            </div>

            <div style={{ marginTop: "0.2rem", color: "#475467" }}>
              {[vehicle.make, vehicle.model, vehicle.year]
                .filter(Boolean)
                .join(" · ")}
            </div>
          </div>

          <form action={retireVehicle} style={{ marginTop: "1.5rem" }}>
            <input
              type="hidden"
              name="vehicle_id"
              value={vehicle.id}
            />

            <div style={{ marginBottom: "1rem" }}>
              <label htmlFor="retirement_reason" style={labelStyle}>
                Removal Reason
              </label>

              <select
                id="retirement_reason"
                name="retirement_reason"
                required
                defaultValue=""
                style={fieldStyle}
              >
                <option value="" disabled>
                  Select a reason
                </option>
                <option value="sold">Sold</option>
                <option value="wrecked">Wrecked</option>
                <option value="stolen">Stolen</option>
                <option value="donated">Donated</option>
                <option value="replaced">Replaced</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label htmlFor="sale_price" style={labelStyle}>
                Sale Price
              </label>

              <input
                id="sale_price"
                name="sale_price"
                type="number"
                min="0"
                step="0.01"
                placeholder="Leave blank if not sold"
                style={fieldStyle}
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label htmlFor="retirement_notes" style={labelStyle}>
                Removal Notes
              </label>

              <textarea
                id="retirement_notes"
                name="retirement_notes"
                rows={5}
                placeholder="Optional notes"
                style={fieldStyle}
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                flexWrap: "wrap",
              }}
            >
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
                Remove Vehicle
              </button>

              <Link
                href={`/vehicles/${vehicle.id}`}
                style={{ textDecoration: "none" }}
              >
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
  );
}
