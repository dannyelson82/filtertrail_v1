"use server";

import { redirect } from "next/navigation";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8001";

export async function retireVehicle(formData) {
  const vehicleId = String(formData.get("vehicle_id") || "").trim();

  const retirementReason = String(
    formData.get("retirement_reason") || ""
  ).trim();

  const retirementNotes = String(
    formData.get("retirement_notes") || ""
  ).trim();

  const salePriceValue = String(
    formData.get("sale_price") || ""
  ).trim();

  if (!vehicleId || !retirementReason) {
    throw new Error("A vehicle and retirement reason are required.");
  }

  const salePrice =
    salePriceValue === "" ? null : Number(salePriceValue);

  if (
    salePrice !== null &&
    (!Number.isFinite(salePrice) || salePrice < 0)
  ) {
    throw new Error("Sale price must be a valid non-negative number.");
  }

  const response = await fetch(
    `${API_BASE}/api/vehicles/${encodeURIComponent(vehicleId)}/retire`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        retired: true,
        retirement_reason: retirementReason,
        retirement_notes: retirementNotes || null,
        sale_price: salePrice,
      }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    let detail = "Could not retire vehicle.";

    try {
      const body = await response.json();
      detail = body.detail || detail;
    } catch {
      // Keep the default error message.
    }

    throw new Error(detail);
  }

  redirect("/vehicles");
}
