"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const API_BASE = process.env.API_BASE_URL || "http://localhost:8001";

function optionalText(formData, name) {
  const value = String(formData.get(name) || "").trim();
  return value || null;
}

export async function createBorrower(formData) {
  const returnTo = String(formData.get("return_to") || "/borrowers");

  const payload = {
    name: String(formData.get("name") || "").trim(),
    phone: optionalText(formData, "phone"),
    email: optionalText(formData, "email"),
    address: optionalText(formData, "address"),
    notes: optionalText(formData, "notes"),
  };

  if (!payload.name) {
    throw new Error("Borrower name is required.");
  }

  const response = await fetch(`${API_BASE}/api/borrowers/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Could not save borrower. API returned ${response.status}: ${body}`);
  }

  revalidatePath("/borrowers");
  revalidatePath("/loans/new");

  redirect(returnTo);
}
