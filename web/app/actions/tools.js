"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const API_BASE = process.env.API_BASE_URL || "http://localhost:8001";

function optionalText(formData, name) {
  const value = String(formData.get(name) || "").trim();
  return value || null;
}

function optionalNumber(formData, name) {
  const value = String(formData.get(name) || "").trim();
  return value === "" ? null : Number(value);
}

function toolPayload(formData) {
  return {
    name: String(formData.get("name") || "").trim(),
    category: String(formData.get("category") || "").trim(),
    brand: optionalText(formData, "brand"),
    model: optionalText(formData, "model"),
    serial_number: optionalText(formData, "serial_number"),
    purchase_date: formData.get("purchase_date") || null,
    purchase_price: optionalNumber(formData, "purchase_price"),
    current_value: optionalNumber(formData, "current_value"),
    location: optionalText(formData, "location"),
    condition_status: optionalText(formData, "condition_status") || "good",
    notes: optionalText(formData, "notes"),
  };
}

async function throwForApiError(response, action) {
  if (response.ok) return;

  const body = await response.text();
  throw new Error(`Could not ${action}. API returned ${response.status}: ${body}`);
}

export async function createTool(formData) {
  const response = await fetch(`${API_BASE}/api/tools/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toolPayload(formData)),
    cache: "no-store",
  });

  await throwForApiError(response, "save tool");

  revalidatePath("/tools");
  revalidatePath("/dashboard");
  redirect("/tools");
}

export async function updateTool(formData) {
  const toolId = Number(formData.get("tool_id"));

  if (!Number.isInteger(toolId) || toolId < 1) {
    throw new Error("Invalid tool ID.");
  }

  const response = await fetch(`${API_BASE}/api/tools/${toolId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toolPayload(formData)),
    cache: "no-store",
  });

  await throwForApiError(response, "update tool");

  revalidatePath("/tools");
  revalidatePath(`/tools/${toolId}`);
  revalidatePath("/dashboard");
  redirect(`/tools/${toolId}`);
}
