"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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

const initialForm = {
  name: "",
  type: "",
  vin: "",
  make: "",
  model: "",
  year: "",
  color: "",
  license_plate: "",
  purchase_date: "",
  purchase_price: "",
  current_value: "",
  notes: "",
};

function stringValue(value) {
  return value === null || value === undefined ? "" : String(value);
}

export default function EditVehiclePage() {
  const params = useParams();
  const router = useRouter();
  const vehicleId = params?.vehicleId;

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!vehicleId) return;

    let cancelled = false;

    async function loadVehicle() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/vehicles/${vehicleId}`, {
          cache: "no-store",
        });

        const body = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            body?.detail || body?.error || "Could not load vehicle."
          );
        }

        if (!cancelled) {
          setForm({
            name: stringValue(body.name),
            type: stringValue(body.type),
            vin: stringValue(body.vin),
            make: stringValue(body.make),
            model: stringValue(body.model),
            year: stringValue(body.year),
            color: stringValue(body.color),
            license_plate: stringValue(body.license_plate),
            purchase_date: stringValue(body.purchase_date),
            purchase_price: stringValue(body.purchase_price),
            current_value: stringValue(body.current_value),
            notes: stringValue(body.notes),
          });
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError.message || "Could not load vehicle.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadVehicle();

    return () => {
      cancelled = true;
    };
  }, [vehicleId]);

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function submitForm(event) {
    event.preventDefault();

    if (saving) return;

    setSaving(true);
    setError("");

    const payload = {
      name: form.name.trim(),
      type: form.type.trim(),
      vin: form.vin.trim() || null,
      make: form.make.trim() || null,
      model: form.model.trim() || null,
      year: form.year ? Number(form.year) : null,
      color: form.color.trim() || null,
      license_plate: form.license_plate.trim() || null,
      purchase_date: form.purchase_date || null,
      purchase_price: form.purchase_price
        ? Number(form.purchase_price)
        : null,
      current_value: form.current_value
        ? Number(form.current_value)
        : null,
      notes: form.notes.trim() || null,
    };

    if (!payload.name || !payload.type) {
      setError("Name and type are required.");
      setSaving(false);
      return;
    }

    try {
      const response = await fetch(`/api/vehicles/${vehicleId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const body = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          body?.detail || body?.error || "Could not update vehicle."
        );
      }

      router.push(`/vehicles/${vehicleId}`);
      router.refresh();
    } catch (requestError) {
      setError(requestError.message || "Could not update vehicle.");
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main
        style={{
          padding: "1.5rem",
          fontFamily: "system-ui, sans-serif",
          maxWidth: 680,
          margin: "0 auto",
        }}
      >
        <h1 style={{ color: "#101828" }}>Edit Vehicle</h1>
        <p style={{ color: "#667085" }}>Loading vehicle...</p>
      </main>
    );
  }

  return (
    <main
      style={{
        padding: "1.5rem",
        fontFamily: "system-ui, sans-serif",
        maxWidth: 680,
        margin: "0 auto",
      }}
    >
      <Link
        href={`/vehicles/${vehicleId}`}
        style={{
          display: "inline-block",
          marginBottom: "1rem",
          color: "#175cd3",
          textDecoration: "none",
          fontWeight: 600,
        }}
      >
        ← Go Back
      </Link>

      <section
        style={{
          border: "1px solid #d0d5dd",
          borderRadius: 10,
          background: "#fff",
          padding: "1.25rem",
        }}
      >
        <h1 style={{ margin: 0, color: "#101828" }}>Edit Vehicle</h1>

        {error ? (
          <div
            role="alert"
            style={{
              marginTop: "1rem",
              padding: "0.75rem",
              border: "1px solid #fecdca",
              borderRadius: 6,
              background: "#fef3f2",
              color: "#b42318",
            }}
          >
            {error}
          </div>
        ) : null}

        <form onSubmit={submitForm} style={{ marginTop: "1.25rem" }}>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="name" style={labelStyle}>
              Name
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={updateField}
              required
              style={fieldStyle}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="type" style={labelStyle}>
              Type
            </label>
            <input
              id="type"
              name="type"
              value={form.type}
              onChange={updateField}
              required
              style={fieldStyle}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1rem",
            }}
          >
            <div>
              <label htmlFor="make" style={labelStyle}>
                Make
              </label>
              <input
                id="make"
                name="make"
                value={form.make}
                onChange={updateField}
                style={fieldStyle}
              />
            </div>

            <div>
              <label htmlFor="model" style={labelStyle}>
                Model
              </label>
              <input
                id="model"
                name="model"
                value={form.model}
                onChange={updateField}
                style={fieldStyle}
              />
            </div>

            <div>
              <label htmlFor="year" style={labelStyle}>
                Year
              </label>
              <input
                id="year"
                name="year"
                type="number"
                value={form.year}
                onChange={updateField}
                style={fieldStyle}
              />
            </div>

            <div>
              <label htmlFor="color" style={labelStyle}>
                Color
              </label>
              <input
                id="color"
                name="color"
                value={form.color}
                onChange={updateField}
                style={fieldStyle}
              />
            </div>

            <div>
              <label htmlFor="license_plate" style={labelStyle}>
                License Plate
              </label>
              <input
                id="license_plate"
                name="license_plate"
                value={form.license_plate}
                onChange={updateField}
                style={fieldStyle}
              />
            </div>

            <div>
              <label htmlFor="vin" style={labelStyle}>
                VIN
              </label>
              <input
                id="vin"
                name="vin"
                value={form.vin}
                onChange={updateField}
                style={fieldStyle}
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            <div>
              <label htmlFor="purchase_date" style={labelStyle}>
                Purchase Date
              </label>
              <input
                id="purchase_date"
                name="purchase_date"
                type="date"
                value={form.purchase_date}
                onChange={updateField}
                style={fieldStyle}
              />
            </div>

            <div>
              <label htmlFor="purchase_price" style={labelStyle}>
                Purchase Price
              </label>
              <input
                id="purchase_price"
                name="purchase_price"
                type="number"
                step="0.01"
                value={form.purchase_price}
                onChange={updateField}
                style={fieldStyle}
              />
            </div>

            <div>
              <label htmlFor="current_value" style={labelStyle}>
                Current Value
              </label>
              <input
                id="current_value"
                name="current_value"
                type="number"
                step="0.01"
                value={form.current_value}
                onChange={updateField}
                style={fieldStyle}
              />
            </div>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <label htmlFor="notes" style={labelStyle}>
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows="5"
              value={form.notes}
              onChange={updateField}
              style={fieldStyle}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
              marginTop: "1.25rem",
            }}
          >
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: "0.6rem 1rem",
                cursor: saving ? "wait" : "pointer",
                border: "1px solid #175cd3",
                borderRadius: 6,
                background: saving ? "#98a2b3" : "#175cd3",
                color: "#fff",
                fontWeight: 700,
              }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <Link
              href={`/vehicles/${vehicleId}`}
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
  );
}
