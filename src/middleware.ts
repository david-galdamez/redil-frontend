import { defineMiddleware } from "astro:middleware";

const API_URL = import.meta.env.PUBLIC_API_URL || "http://localhost:4000";

export const onRequest = defineMiddleware(async (context, next) => {
    const { request, redirect, url } = context

    const publicRoutes = ["/login"]

    const isPublic = publicRoutes.some((route) => url.pathname.startsWith(route))

    if (isPublic) {
        const response = await fetch(`${API_URL}/api/auth/loged-in`, {
            headers: {
                cookie: request.headers.get("cookie") ?? "",
            },
        });

        if (response.status === 204) {
            return redirect("/dashboard");
        }

        return next();
    }

    try {
        const response = await fetch(`${API_URL}/api/auth/loged-in`, {
            headers: {
                cookie: request.headers.get("access_token") || "",
            },
        });

        if (response.status === 401) {
            return redirect("/login");
        }

        return next();
    } catch (error) {
        console.error("Error checking authentication:", error);
        return redirect("/login");
    }
});