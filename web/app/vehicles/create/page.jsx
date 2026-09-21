"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "../../../components/Navbar";

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

const secondaryButtonStyle = {
  padding: "0.5rem 0.75rem",
  cursor: "pointer",
  border: "1px solid #98a2b3",
  borderRadius: 6,
  background: "#fff",
  color: "#344054",
  fontWeight: 600,
};

export default function CreateVehiclePage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    vehicle_type_id: "",
    make: "",
    model: "",
    year: "",
    vin: "",
    color: "",
    license_plate: "",
    purchase_date: "",
    purchase_price: "",
    current_value: "",
    notes: "",
  });

  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [typeLoading, setTypeLoading] = useState(true);
  const [showNewType, setShowNewType] = useState(false);
  const [newTypeName, setNewTypeName] = useState("");
  const [newTypeIcon, setNewTypeIcon] = useState("vehicle");
  const [creatingType, setCreatingType] = useState(false);
  const [error, setError] = useState("");
  const [typeError, setTypeError] = useState("");

  async function loadVehicleTypes() {
    setTypeLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/vehicle-types/`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Could not load vehicle types.");
      }

      const types = await response.json();
      setVehicleTypes(types);
    } catch (err) {
      setTypeError(err.message || "Could not load vehicle types.");
    } finally {
      setTypeLoading(false);
    }
  }

  useEffect(() => {
    loadVehicleTypes();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  }

  async function handleCreateVehicleType() {
    const name = newTypeName.trim();

    if (!name) {
      setTypeError("Enter a name for the new vehicle type.");
      return;
    }

    setCreatingType(true);
    setTypeError("");

    try {
      const response = await fetch(`${API_BASE}/api/vehicle-types/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          icon_key: newTypeIcon,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Could not create vehicle type.");
      }

      setVehicleTypes((current) =>
        [...current, data].sort((a, b) => a.name.localeCompare(b.name)),
      );

      setFormData((previous) => ({
        ...previous,
        vehicle_type_id: String(data.id),
      }));

      setNewTypeName("");
      setNewTypeIcon("vehicle");
      setShowNewType(false);
    } catch (err) {
      setTypeError(err.message || "Could not create vehicle type.");
    } finally {
      setCreatingType(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const selectedType = vehicleTypes.find(
      (vehicleType) =>
        String(vehicleType.id) === String(formData.vehicle_type_id),
    );

    const payload = {
      name: formData.name.trim(),
      type: selectedType?.name || "",
      vehicle_type_id: formData.vehicle_type_id
        ? Number(formData.vehicle_type_id)
        : null,
      make: formData.make.trim() || null,
      model: formData.model.trim() || null,
      year: formData.year ? Number(formData.year) : null,
      vin: formData.vin.trim() || null,
      color: formData.color.trim() || null,
      license_plate: formData.license_plate.trim() || null,
      purchase_date: formData.purchase_date || null,
      purchase_price: formData.purchase_price
        ? Number(formData.purchase_price)
        : null,
      current_value: formData.current_value
        ? Number(formData.current_value)
        : null,
      notes: formData.notes.trim() || null,
    };

    if (!payload.name) {
      setError("Vehicle name is required.");
      return;
    }

    if (!payload.vehicle_type_id || !payload.type) {
      setError("Select a vehicle type or create a new one.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/vehicles/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(
          data?.detail || `API error: ${response.status}`,
        );
      }

      router.push("/vehicles");
      router.refresh();
    } catch (err) {
      setError(err.message || "Could not create vehicle.");
    }
  }

  return (
    <div className="app-shell">
      <Navbar />

      <div className="app-content">
        <main
          style={{
            padding: "1.5rem",
            fontFamily: "system-ui, sans-serif",
            maxWidth: 720,
            margin: "0 auto",
          }}
        >
          <h1 style={{ color: "#101828", margin: 0 }}>Add Vehicle</h1>

          <p style={{ color: "#667085", marginTop: "0.45rem" }}>
            Create a new vehicle record.
          </p>

          <form onSubmit={handleSubmit} style={{ marginTop: "1.25rem" }}>
            {error ? (
              <div
                role="alert"
                style={{
                  marginBottom: "1rem",
                  padding: "0.75rem",
                  borderRadius: 6,
                  background: "#fef3f2",
                  border: "1px solid #fecdca",
                  color: "#b42318",
                }}
              >
                {error}
              </div>
            ) : null}

            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle} htmlFor="name">
                Name
              </label>

              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={fieldStyle}
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle} htmlFor="vehicle_type_id">
                Vehicle Type
              </label>

              <select
                id="vehicle_type_id"
                name="vehicle_type_id"
                value={formData.vehicle_type_id}
                onChange={handleChange}
                disabled={typeLoading}
                required
                style={fieldStyle}
              >
                <option value="">
                  {typeLoading
                    ? "Loading vehicle types…"
                    : "Select a vehicle type"}
                </option>

                {vehicleTypes.map((vehicleType) => (
                  <option key={vehicleType.id} value={vehicleType.id}>
                    {vehicleType.name}
                  </option>
                ))}
              </select>

              <div style={{ marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewType((visible) => !visible);
                    setTypeError("");
                  }}
                  style={secondaryButtonStyle}
                >
                  {showNewType
                    ? "Cancel New Type"
                    : "+ Create New Vehicle Type"}
                </button>
              </div>
            </div>

            {showNewType ? (
              <section
                style={{
                  marginBottom: "1rem",
                  padding: "1rem",
                  border: "1px solid #d0d5dd",
                  borderRadius: 8,
                  background: "#f9fafb",
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    color: "#101828",
                    fontSize: "1rem",
                  }}
                >
                  Create Vehicle Type
                </h2>

                <div style={{ marginTop: "0.8rem" }}>
                  <label style={labelStyle} htmlFor="new_vehicle_type_name">
                    Type Name
                  </label>

                  <input
                    id="new_vehicle_type_name"
                    value={newTypeName}
                    onChange={(event) => setNewTypeName(event.target.value)}
                    maxLength={100}
                    placeholder="e.g. ATV, Truck, Snowmobile"
                    style={fieldStyle}
                  />
                </div>

                <div style={{ marginTop: "0.8rem" }}>
                  <label style={labelStyle} htmlFor="new_vehicle_type_icon">
                    Icon
                  </label>

                  <select
                    id="new_vehicle_type_icon"
                    value={newTypeIcon}
                    onChange={(event) => setNewTypeIcon(event.target.value)}
                    style={fieldStyle}
                  >
                    <option value="vehicle">General vehicle</option>
                    <option value="boat">Boat</option>
                    <option value="truck">Truck</option>
                    <option value="atv">ATV</option>
                    <option value="snowmobile">Snowmobile</option>
                    <option value="motorcycle">Motorcycle</option>
                    <option value="car">Car</option>
                    <option value="trailer">Trailer</option>
                  </select>
                </div>

                {typeError ? (
                  <p
                    role="alert"
                    style={{
                      margin: "0.8rem 0 0",
                      color: "#b42318",
                      fontSize: "0.9rem",
                    }}
                  >
                    {typeError}
                  </p>
                ) : null}

                <button
                  type="button"
                  onClick={handleCreateVehicleType}
                  disabled={creatingType}
                  style={{
                    marginTop: "0.9rem",
                    padding: "0.5rem 0.75rem",
                    cursor: creatingType ? "wait" : "pointer",
                    border: "1px solid #175cd3",
                    borderRadius: 6,
                    background: "#175cd3",
                    color: "#fff",
                    fontWeight: 700,
                    opacity: creatingType ? 0.7 : 1,
                  }}
                >
                  {creatingType ? "Creating Type…" : "Create and Select Type"}
                </button>
              </section>
            ) : null}

            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle} htmlFor="make">
                Make
              </label>

              <input
                id="make"
                name="make"
                value={formData.make}
                onChange={handleChange}
                style={fieldStyle}
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle} htmlFor="model">
                Model
              </label>

              <input
                id="model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                style={fieldStyle}
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle} htmlFor="year">
                Year
              </label>

              <input
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                type="number"
                min="1900"
                max="2100"
                style={fieldStyle}
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle} htmlFor="vin">
                VIN
              </label>

              <input
                id="vin"
                name="vin"
                value={formData.vin}
                onChange={handleChange}
                style={fieldStyle}
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle} htmlFor="color">
                Color
              </label>

              <input
                id="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                style={fieldStyle}
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle} htmlFor="license_plate">
                License Plate
              </label>

              <input
                id="license_plate"
                name="license_plate"
                value={formData.license_plate}
                onChange={handleChange}
                style={fieldStyle}
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle} htmlFor="purchase_date">
                Purchase Date
              </label>

              <input
                id="purchase_date"
                name="purchase_date"
                value={formData.purchase_date}
                onChange={handleChange}
                type="date"
                style={fieldStyle}
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle} htmlFor="purchase_price">
                Purchase Price
              </label>

              <input
                id="purchase_price"
                name="purchase_price"
                value={formData.purchase_price}
                onChange={handleChange}
                type="number"
                step="0.01"
                min="0"
                style={fieldStyle}
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle} htmlFor="current_value">
                Current Value
              </label>

              <input
                id="current_value"
                name="current_value"
                value={formData.current_value}
                onChange={handleChange}
                type="number"
                step="0.01"
                min="0"
                style={fieldStyle}
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle} htmlFor="notes">
                Notes
              </label>

              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="4"
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
                Create Vehicle
              </button>

              <button
                type="button"
                onClick={() => router.back()}
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
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
