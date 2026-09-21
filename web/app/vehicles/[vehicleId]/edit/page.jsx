"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Navbar } from "../../../../components/Navbar";

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

export default function EditVehiclePage() {
  const router = useRouter();
  const params = useParams();
  const vehicleId = Number(params.vehicleId);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    make: "",
    model: "",
    year: "",
    vin: "",
    color: "",
    license_plate: "",
    purchase_date: "",
    purchase_price: "",
    current_value: "",
    estimated_resale_value: "",
    insurance_value: "",
    location: "",
    condition_status: "good",
    notes: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!Number.isInteger(vehicleId) || vehicleId < 1) {
      setError("Invalid vehicle ID.");
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    (async () => {
      try {
        const url = `/api/vehicles/${vehicleId}`;
        console.log("Fetching vehicle from", url);

        const response = await fetch(url, {
          signal: controller.signal,
          cache: "no-store",
        });

        clearTimeout(timeoutId);
        console.log("Vehicle response status", response.status);

        if (!response.ok) {
          const text = await response.text();
          console.error("Vehicle error body", text);
          throw new Error(`API error: ${response.status} - ${text}`);
        }

        const v = await response.json();
        console.log("Vehicle loaded", v);

        setFormData({
          name: v.name || "",
          type: v.type || "",
          make: v.make || "",
          model: v.model || "",
          year: v.year ?? "",
          vin: v.vin || "",
          color: v.color || "",
          license_plate: v.license_plate || "",
          purchase_date: v.purchase_date || "",
          purchase_price: v.purchase_price ?? "",
          current_value: v.current_value ?? "",
          estimated_resale_value: v.estimated_resale_value ?? "",
          insurance_value: v.insurance_value ?? "",
          location: v.location || "",
          condition_status: v.condition_status || "good",
          notes: v.notes || "",
        });
      } catch (err) {
        console.error("Failed to load vehicle", err);
        if (err.name === "AbortError") {
          setError("Request timed out after 8 seconds. Check server logs.");
        } else {
          setError(err.message || "Could not load vehicle.");
        }
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
      }
    })();

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [vehicleId]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const payload = {
      name: formData.name.trim(),
      type: formData.type.trim() || null,
      make: formData.make.trim() || null,
      model: formData.model.trim() || null,
      year: formData.year ? Number(formData.year) : null,
      vin: formData.vin.trim() || null,
      color: formData.color.trim() || null,
      license_plate: formData.license_plate.trim() || null,
      purchase_date: formData.purchase_date || null,
      purchase_price: formData.purchase_price ? Number(formData.purchase_price) : null,
      current_value: formData.current_value ? Number(formData.current_value) : null,
      estimated_resale_value: formData.estimated_resale_value
        ? Number(formData.estimated_resale_value)
        : null,
      insurance_value: formData.insurance_value ? Number(formData.insurance_value) : null,
      location: formData.location.trim() || null,
      condition_status: formData.condition_status || "good",
      notes: formData.notes.trim() || null,
    };

    if (!payload.name) {
      setError("Name is required.");
      return;
    }

    try {
      const response = await fetch(`/api/vehicles/${vehicleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`API error: ${response.status} - ${text}`);
      }

      router.push(`/vehicles/${vehicleId}`);
    } catch (err) {
      setError(err.message || "Could not update vehicle.");
    }
  }

  if (loading) {
    return (
      <div>
        <Navbar />
        <main style={{ padding: "1.5rem", fontFamily: "system-ui, sans-serif" }}>
          Loading vehicle...
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <main
          style={{
            padding: "1.5rem",
            fontFamily: "system-ui, sans-serif",
            maxWidth: 720,
            margin: "0 auto",
          }}
        >
          <h1 style={{ color: "#101828", margin: 0 }}>Edit Vehicle</h1>

          <div
            style={{
              marginTop: "1rem",
              padding: "0.75rem",
              borderRadius: 6,
              background: "#fef3f2",
              border: "1px solid #fecdca",
              color: "#b42318",
            }}
          >
            {error}
          </div>

          <button
            type="button"
            onClick={() => router.back()}
            style={{
              marginTop: "1rem",
              padding: "0.6rem 1rem",
              cursor: "pointer",
              border: "1px solid #98a2b3",
              borderRadius: 6,
              background: "#fff",
              color: "#344054",
              fontWeight: 600,
            }}
          >
            Go Back
          </button>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <main
        style={{
          padding: "1.5rem",
          fontFamily: "system-ui, sans-serif",
          maxWidth: 720,
          margin: "0 auto",
        }}
      >
        <h1 style={{ color: "#101828", margin: 0 }}>Edit Vehicle</h1>

        <p style={{ color: "#667085", marginTop: "0.45rem" }}>
          Update vehicle details, including pricing.
        </p>

        <form onSubmit={handleSubmit} style={{ marginTop: "1.25rem" }}>
          {error ? (
            <div
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
            <label style={labelStyle}>Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={fieldStyle}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={labelStyle}>Type</label>
            <input
              name="type"
              value={formData.type}
              onChange={handleChange}
              style={fieldStyle}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={labelStyle}>Make</label>
            <input
              name="make"
              value={formData.make}
              onChange={handleChange}
              style={fieldStyle}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={labelStyle}>Model</label>
            <input
              name="model"
              value={formData.model}
              onChange={handleChange}
              style={fieldStyle}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={labelStyle}>Year</label>
            <input
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
            <label style={labelStyle}>VIN</label>
            <input
              name="vin"
              value={formData.vin}
              onChange={handleChange}
              style={fieldStyle}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={labelStyle}>Color</label>
            <input
              name="color"
              value={formData.color}
              onChange={handleChange}
              style={fieldStyle}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={labelStyle}>License Plate</label>
            <input
              name="license_plate"
              value={formData.license_plate}
              onChange={handleChange}
              style={fieldStyle}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={labelStyle}>Purchase Date</label>
            <input
              name="purchase_date"
              value={formData.purchase_date}
              onChange={handleChange}
              type="date"
              style={fieldStyle}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={labelStyle}>Purchase Price</label>
            <input
              name="purchase_price"
              value={formData.purchase_price}
              onChange={handleChange}
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              style={fieldStyle}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={labelStyle}>Current Value</label>
            <input
              name="current_value"
              value={formData.current_value}
              onChange={handleChange}
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              style={fieldStyle}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={labelStyle}>Estimated Resale Value</label>
            <input
              name="estimated_resale_value"
              value={formData.estimated_resale_value}
              onChange={handleChange}
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              style={fieldStyle}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={labelStyle}>Insurance Value</label>
            <input
              name="insurance_value"
              value={formData.insurance_value}
              onChange={handleChange}
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              style={fieldStyle}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={labelStyle}>Storage Location</label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              style={fieldStyle}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={labelStyle}>Condition</label>
            <select
              name="condition_status"
              value={formData.condition_status}
              onChange={handleChange}
              style={fieldStyle}
            >
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={labelStyle}>Notes</label>
            <textarea
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
              Save Changes
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
  );
}
