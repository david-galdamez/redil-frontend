import type { APIRoute } from "astro";

export const GET: APIRoute = ({ cookies, redirect }) => {
  cookies.delete("access_token", { path: "/" });
  return redirect("/login");
};
