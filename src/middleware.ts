import { defineMiddleware } from "astro:middleware";
import type { Locals } from "astro";
import { getRoleRute, isPublicRoute } from "./lib/authHelper";
import { publicRoutes, roleRoutes } from "./lib/authConfig";
import { jwtDecode } from "jwt-decode";

type JwtUser = {
    id: string;
    email: string;
    role: string;
    redil_id?: string
}

export const onRequest = defineMiddleware(async (context, next) => {
    const { redirect, url, cookies } = context

    const pathname = url.pathname;

    const token = cookies.get("access_token")?.value;

    const isPublic = isPublicRoute(pathname, publicRoutes);
    const isLogin = pathname === "/login";

    let user: JwtUser | null = null;

    if (token) {
        try {
            user = jwtDecode<JwtUser>(token);
        } catch (err) {
            console.error("Error decoding JWT:", err);
            user = null;
        }
    }

    (context.locals as Locals).user = user;

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
        return redirect("/dashboard");
    }

    return next();
});