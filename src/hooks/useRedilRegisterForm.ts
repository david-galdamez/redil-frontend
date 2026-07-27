import { useState } from "react";
import { toast } from "@pheralb/toast";
import { apiClient } from "../lib/api/client";

const initialForm = { name: "", phone: "", email: "", isServer: false, groupId: "" };
const initialErrors = { name: "", phone: "", email: "", groupId: "", general: "" };
const VALIDATED_FIELDS = ["name", "phone", "email", "groupid"] as const;

export function useRedilRegisterForm(redilCode: string) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(initialErrors);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors(initialErrors);

    if (!form.groupId) {
      setErrors((prev) => ({ ...prev, groupId: "Debes seleccionar un grupo" }));
      return;
    }

    setLoading(true);
    try {
      const result = await apiClient.post<number>(`api/student/register/${redilCode}`, form);

      if (result.errors) {
        result.errors.forEach((err) => {
          const field = err.field.toLowerCase();
          const mapped = field === "groupid" ? "groupId" : field;
          if (VALIDATED_FIELDS.includes(field as (typeof VALIDATED_FIELDS)[number])) {
            setErrors((prev) => ({ ...prev, [mapped]: err.message }));
          }
        });
        return;
      }

      if (result.error) {
        setErrors((prev) => ({ ...prev, general: result.error || "Ocurrió un error desconocido" }));
        return;
      }

      toast.success({ text: "Inscripción exitosa" });
      setForm(initialForm);
    } catch (e) {
      console.error("Error submitting form:", e);
      toast.error({ text: "Ocurrió un error de conexión" });
    } finally {
      setLoading(false);
    }
  };

  return { form, loading, errors, handleChange, handleSubmit };
}
