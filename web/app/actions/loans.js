"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const API_BASE = process.env.API_BASE_URL || "http://192.168.50.37:8001";

function optionalText(formData, name) {
  const value = String(formData.get(name) || "").trim();
  return value || null;
}

export async function createLoan(formData) {
  const toolId = Number(formData.get("tool_id"));
  const borrowerId = Number(formData.get("borrower_id"));
  const dueDate = formData.get("due_date");
  const dueTime = formData.get("due_time") || "17:00";

  if (!Number.isInteger(toolId) || toolId < 1) {
    throw new Error("Please select a tool.");
  }

  if (!Number.isInteger(borrowerId) || borrowerId < 1) {
    throw new Error("Please select a borrower.");
  }

  const payload = {
    tool_id: toolId,
    borrower_id: borrowerId,
    borrower_name: "",
    due_date: dueDate ? `${dueDate}T${dueTime}:00` : null,
    condition_at_checkout: optionalText(formData, "condition_at_checkout"),
    notes: optionalText(formData, "notes"),
  };

  const response = await fetch(`${API_BASE}/api/loans/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Could not save loan. API returned ${response.status}: ${body}`);
  }

  revalidatePath("/tools");
  revalidatePath("/loans");
  revalidatePath("/dashboard");
  redirect("/loans");
}
