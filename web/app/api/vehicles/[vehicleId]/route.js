import { NextResponse } from "next/server";

const API_BASE = process.env.API_BASE_URL || "http://localhost:8001";

export async function GET(request, { params }) {
  const { vehicleId } = params;

  const url = `${API_BASE}/api/vehicles/${vehicleId}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      return new NextResponse(text, {
        status: res.status,
        headers: { "Content-Type": "text/plain" },
      });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return new NextResponse(`Proxy error: ${err.message}`, {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}

export async function PUT(request, { params }) {
  const { vehicleId } = params;
  const body = await request.json();

  const url = `${API_BASE}/api/vehicles/${vehicleId}`;

  try {
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      return new NextResponse(text, {
        status: res.status,
        headers: { "Content-Type": "text/plain" },
      });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return new NextResponse(`Proxy error: ${err.message}`, {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
