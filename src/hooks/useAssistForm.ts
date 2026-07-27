import { useState } from "react";
import { toast } from "@pheralb/toast";
import { apiClient, type Error } from "../lib/api/client";

export function useAssistForm(attendanceToken: string) {
  const [form, setForm] = useState({ phone: "", attended: false });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ phone: "", general: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const setPhone = (phone: string) => setForm((prev) => ({ ...prev, phone }));

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({ phone: "", general: "" });
    try {
      const result = await apiClient.post<string>(
        `api/class/assist/register/${attendanceToken}`,
        form
      );

      if (result.errors) {
        result.errors.forEach((err: Error) => {
          if (err.field.toLowerCase() === "phone") {
            setErrors((prev) => ({ ...prev, phone: err.message }));
          }
        });
        return;
      }

      if (result.error) {
        setErrors((prev) => ({ ...prev, general: result.error || "Ocurrió un error desconocido" }));
        return;
      }

      setForm({ phone: "", attended: false });
      toast.success({ text: "Asistencia registrada con éxito" });
    } catch (err) {
      console.error("Error registering assist:", err);
      toast.error({ text: "Ocurrió un error inesperado" });
    } finally {
      setLoading(false);
    }
  };

  return { form, loading, errors, handleChange, handleSubmit, setPhone };
}
