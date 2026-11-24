"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const API_BASE = process.env.API_BASE_URL || "http://localhost:8001";

export async function retireTool(formData) {
  const toolId = Number(formData.get("tool_id"));
  const reason = String(formData.get("retirement_reason") || "").trim();
  const notes = String(formData.get("retirement_notes") || "").trim() || null;

  if (!Number.isInteger(toolId) || toolId < 1) {
    throw new Error("Invalid tool ID.");
  }

  if (!reason) {
    throw new Error("Please select a removal reason.");
  }

  const response = await fetch(`${API_BASE}/api/tools/${toolId}`, {
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
    throw new Error(`Could not remove tool. API returned ${response.status}: ${body}`);
  }

  revalidatePath("/tools");
  revalidatePath("/dashboard");
  revalidatePath(`/tools/${toolId}`);

  redirect("/tools");
}
