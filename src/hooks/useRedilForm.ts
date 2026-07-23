import { useState, useEffect } from "react";
import { toast } from "@pheralb/toast";
import { apiClient } from "../lib/api/client";

const initialErrors = { name: "", description: "", general: "" };

export function useRedilForm(id: string, redil: RedilDetailsDto) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: redil.name, description: redil.description });
  const [errors, setErrors] = useState(initialErrors);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm({ name: redil.name, description: redil.description });
    setErrors(initialErrors);
  }, [redil]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setForm({ name: redil.name, description: redil.description });
    setErrors(initialErrors);
    setEditing(false);
  };

  const handleSubmit = async () => {
    setErrors(initialErrors);
    setLoading(true);
    try {
      const result = await apiClient.put<RedilDetailsDto>(`api/redil/${id}`, form);

      if (result.errors) {
        result.errors.forEach((err) => {
          const field = err.field.toLowerCase() as "name" | "description";
          if (field === "name" || field === "description") {
            setErrors(prev => ({ ...prev, [field]: err.message }));
          }
        });
        return;
      }

      if (result.error) {
        setErrors(prev => ({ ...prev, general: result.error || "Ocurrió un error inesperado" }));
        return;
      }

      toast.success({ text: "Redil actualizada exitosamente" });
      setEditing(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error({ text: "Ocurrió un error de red" });
    } finally {
      setLoading(false);
    }
  };

  return { editing, setEditing, form, errors, loading, handleChange, handleCancel, handleSubmit };
}
