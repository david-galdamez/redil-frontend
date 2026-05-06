import { toast } from "@pheralb/toast";
import { useState } from "react";

export function usePassAssist(apiUrl: string, classId: number) {
    const [loading, setLoading] = useState(false);

    const passAssist = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${apiUrl}/api/class/assist/${classId}`, {
                method: "PUT",
                credentials: "include",
            });

            const data = (await res.json()) as ApiResponse<string>;

            if (!res.ok) {
                toast.error({ text: data.message || "Ocurrió un error al pasar asistencia." });
                return;
            }

            toast.success({ text: data.message || "Asistencia iniciada con éxito." });
            window.location.reload();
        } catch (e) {
            console.error("Error passing assist:", e);
            toast.error({ text: "Error al pasar asistencia, inténtalo más tarde." });
        } finally {
            setLoading(false);
        }
    };

    return { passAssist, loading };
}