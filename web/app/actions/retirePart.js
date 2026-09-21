"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const API_BASE = process.env.API_BASE_URL || "http://192.168.50.37:8001";

export async function retirePart(formData) {
  const partId = Number(formData.get("part_id"));
  const reason = String(formData.get("retirement_reason") || "").trim();
  const notes = String(formData.get("retirement_notes") || "").trim() || null;

  if (!Number.isInteger(partId) || partId < 1) {
    throw new Error("Invalid part ID.");
  }

  if (!reason) {
    throw new Error("Please select a removal reason.");
  }

  const response = await fetch(`${API_BASE}/api/parts/${partId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      is_retired: true,
      retired_at: new Date().toISOString(),
      retirement_reason: reason,
      retirement_notes: notes,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Could not remove part. API returned ${response.status}: ${body}`);
  }

  revalidatePath("/parts");
  revalidatePath("/dashboard");
  revalidatePath(`/parts/${partId}`);

  redirect("/parts");
}
