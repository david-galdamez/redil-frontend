import { useState } from "react";
import { apiClient } from "../lib/api/client";

export function useFinishCourse() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const finishCourse = async (redilId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiClient.post<boolean>(
        `api/redil/${redilId}/finish-course`,
      );
      if (result.error) {
        setError(result.error);
        return false;
      }
      return true;
    } catch {
      setError("Error de red al terminar el curso");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { finishCourse, loading, error };
}
