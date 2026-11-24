"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const API_BASE = process.env.API_BASE_URL || "http://localhost:8001";

export async function completeToolReturn(formData) {
  const loanId = Number(formData.get("loan_id"));
  const returnTo = String(formData.get("return_to") || "/loans");

  if (!Number.isInteger(loanId) || loanId < 1) {
    throw new Error("Invalid loan ID.");
  }

  const conditionAtReturn =
    String(formData.get("condition_at_return") || "").trim() || null;

  const returnNotes =
    String(formData.get("return_notes") || "").trim() || null;

  const response = await fetch(`${API_BASE}/api/loans/${loanId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      return_date: new Date().toISOString(),
      condition_at_return: conditionAtReturn,
      return_notes: returnNotes,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Could not return tool. API returned ${response.status}: ${body}`);
  }

  revalidatePath("/tools");
  revalidatePath("/loans");
  revalidatePath("/dashboard");

  redirect(returnTo);
}
