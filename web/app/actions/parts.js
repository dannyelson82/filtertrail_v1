"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const API_BASE = process.env.API_BASE_URL || "http://192.168.50.37:8001";

function optionalText(formData, name) {
  const value = String(formData.get(name) || "").trim();
  return value || null;
}

function optionalNumber(formData, name) {
  const value = String(formData.get(name) || "").trim();

  if (value === "") {
    return null;
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    throw new Error(`${name} must be a valid number.`);
  }

  return number;
}

function partPayload(formData) {
  const quantityOnHand =
    optionalNumber(formData, "quantity_on_hand") ?? 0;
  const costPerUnit = optionalNumber(formData, "cost_per_unit");

  return {
    name: String(formData.get("name") || "").trim(),
    category: String(formData.get("category") || "").trim(),

    quantity_on_hand: quantityOnHand,
    unit: optionalText(formData, "unit"),
    min_stock_level: optionalNumber(formData, "min_stock_level"),
    cost_per_unit: costPerUnit,
    supplier: optionalText(formData, "supplier"),

    location: optionalText(formData, "location"),
    part_number: optionalText(formData, "part_number"),
    brand: optionalText(formData, "brand"),
    model_compatibility: optionalText(formData, "model_compatibility"),
    condition_status: optionalText(formData, "condition_status") || "good",
    notes: optionalText(formData, "notes"),

    purchase_date: optionalText(formData, "purchase_date"),
    purchase_price: optionalNumber(formData, "purchase_price"),
    current_value:
      costPerUnit === null ? null : quantityOnHand * costPerUnit,
  };
}

function validatePartPayload(payload) {
  if (!payload.name) {
    throw new Error("Part name is required.");
  }

  if (!payload.category) {
    throw new Error("Category is required.");
  }
}

async function throwForApiError(response, action) {
  if (response.ok) {
    return;
  }

  const body = await response.text();
  throw new Error(`Could not ${action}. API returned ${response.status}: ${body}`);
}

export async function createPart(formData) {
  const payload = partPayload(formData);

  validatePartPayload(payload);

  const response = await fetch(`${API_BASE}/api/parts/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  await throwForApiError(response, "save part");

  revalidatePath("/parts");
  revalidatePath("/dashboard");
  redirect("/parts");
}

export async function updatePart(formData) {
  const partId = Number(formData.get("part_id"));

  if (!Number.isInteger(partId) || partId < 1) {
    throw new Error("Invalid part ID.");
  }

  const payload = partPayload(formData);

  validatePartPayload(payload);

  const response = await fetch(`${API_BASE}/api/parts/${partId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  await throwForApiError(response, "update part");

  revalidatePath("/parts");
  revalidatePath(`/parts/${partId}`);
  revalidatePath("/dashboard");
  redirect(`/parts/${partId}`);
}
