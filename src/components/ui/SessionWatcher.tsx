import { useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "@pheralb/toast";

const CHECK_INTERVAL = 30000;
const WARNING_MINUTES = 5;

export default function SessionWatcher() {
  const warned = useRef(false);

  useEffect(() => {
    const check = () => {
      const raw = localStorage.getItem("auth_token");
      if (!raw) return;

      try {
        const payload = jwtDecode<{ exp: number }>(raw);
        const now = Math.floor(Date.now() / 1000);
        const remaining = payload.exp - now;

        if (remaining <= 0) {
          localStorage.removeItem("auth_token");
          document.cookie = "access_token=; path=/; max-age=0";
          window.location.href = "/login";
          return;
        }

        if (remaining <= WARNING_MINUTES * 60 && !warned.current) {
          warned.current = true;
          toast.warning({
            text: `Tu sesión expirará pronto. Quedan menos de ${WARNING_MINUTES} minutos.`,
          });
        }
      } catch {
        // ignore decode errors
      }
    };

    check();
    const id = setInterval(check, CHECK_INTERVAL);
    return () => clearInterval(id);
  }, []);

  return null;
}
