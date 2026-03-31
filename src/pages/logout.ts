import type { APIRoute } from "astro";

export const POST: APIRoute = ({ cookies, redirect }) => {
    cookies.delete("access_token", { path: "/" });
    return redirect("/login");
};
