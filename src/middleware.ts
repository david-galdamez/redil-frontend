import { defineMiddleware } from "astro:middleware";
import type { Locals } from "astro";
import { getRoleRute, isPublicRoute } from "./lib/authHelper";
import { publicRoutes, roleRoutes } from "./lib/authConfig";
import { jwtDecode } from "jwt-decode";
import type { JwtUser, UserDetailsDto } from "./types/user";
const API_URL = import.meta.env.PUBLIC_API_URL || "http://localhost:3000";

export const onRequest = defineMiddleware(async (context, next) => {
  const { redirect, url, cookies } = context

  const pathname = url.pathname;

  const rawToken = cookies.get("access_token")?.value;

  const isPublic = isPublicRoute(pathname, publicRoutes);
  const isLogin = pathname === "/login";

  let user: JwtUser | null = null;
  let userProfile: UserDetailsDto | null = null;

  if (rawToken) {
    try {
      user = jwtDecode<JwtUser>(rawToken);
    } catch (err) {
      console.error("Error decoding JWT:", err);
      user = null;
    }

    if (user) {
      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${rawToken}` },
        });
        if (response.ok) {
          const json = await response.json();
          userProfile = json.data ?? null;
        }
      } catch {
        // Si falla la obtención del perfil, usamos datos del JWT
      }
    }
  }

  (context.locals as Locals).user = user;
  (context.locals as Locals).token = rawToken ?? null;
  (context.locals as Locals).userProfile = userProfile;

  const rule = getRoleRute(pathname, roleRoutes);

  if (rule) {
    if (!user) return redirect("/login");

    if (!rule.roles.includes(user.role)) {
      return new Response("No Autorizado", { status: 403 });
    }
  }


  if (!user && !isPublic) {
    return redirect("/login");
  }

  if (user && isLogin) {
    return user.role === "Admin"
      ? redirect("/")
      : redirect("/my-redil");
  }

  if (user && user.role === "Maestro" && pathname === "/") {
    return redirect("/my-redil");
  }

  return next();
});
