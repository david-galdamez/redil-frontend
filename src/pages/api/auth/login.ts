import type { APIRoute } from "astro";
import { API_URL } from "../../../lib/api/client";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    const setCookie = res.headers.get("set-cookie");

    const headers = new Headers({ "Content-Type": "application/json" });

    if (setCookie) {
      headers.set("set-cookie", setCookie);
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers
    });
  } catch (e) {
    console.error("[login endpoint]", e);
    return new Response(JSON.stringify({ success: false, message: "Error interno" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
