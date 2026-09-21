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
  return value === "" ? null : Number(value);
}

export async function createPart(formData) {
  const payload = {
    name: String(formData.get("name") || "").trim(),
    category: String(formData.get("category") || "").trim(),
    quantity: Number(formData.get("quantity") || 0),
    unit: optionalText(formData, "unit"),
    location: optionalText(formData, "location"),
    min_stock_level: optionalNumber(formData, "min_stock_level"),
    cost_per_unit: optionalNumber(formData, "cost_per_unit"),
    supplier: optionalText(formData, "supplier"),
    part_number: optionalText(formData, "part_number"),
    notes: optionalText(formData, "notes"),
  };

  const response = await fetch(`${API_BASE}/api/parts/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Could not save part. API returned ${response.status}: ${body}`);
  }

  revalidatePath("/parts");
  revalidatePath("/dashboard");
  redirect("/parts");
}
