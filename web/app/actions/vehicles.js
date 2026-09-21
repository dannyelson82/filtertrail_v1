"use server";

import { redirect } from "next/navigation";

const API_BASE = process.env.API_BASE_URL || "http://192.168.50.37:8001";

export async function createVehicle(formData) {
  const payload = {
    name: formData.get("name") || "",
    type: formData.get("type") || "",
    make: formData.get("make") || "",
    model: formData.get("model") || "",
    year: Number(formData.get("year")) || null,
  };

  await fetch(`${API_BASE}/api/vehicles/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  redirect("/dashboard");
}
