import { toast } from "@pheralb/toast";
import { useState } from "react";
import { apiClient } from "../lib/api/client";

export function usePassAssist(classId: number) {
  const [loading, setLoading] = useState(false);

  const passAssist = async () => {
    setLoading(true);
    try {
      const result = await apiClient.put<string>(`api/class/assist/${classId}`);

      if (result.error) {
        toast.error({ text: result.error || "Ocurrió un error al pasar asistencia." });
        return;
      }

      toast.success({ text: "Asistencia iniciada con éxito." });
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
