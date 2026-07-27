import { useState, useEffect } from "react";
import { toast } from "@pheralb/toast";
import type { UserDetailsDto } from "../types/user";
import { apiClient } from "../lib/api/client";

const initialErrors = { name: "", general: "" };

export function useNameForm(user: UserDetailsDto) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user.name });
  const [errors, setErrors] = useState(initialErrors);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm({ name: user.name });
    setErrors(initialErrors);
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ name: e.target.value });
  };

  const handleCancel = () => {
    setForm({ name: user.name });
    setErrors(initialErrors);
    setEditing(false);
  };

  const handleSubmit = async () => {
    setErrors(initialErrors);

    if (form.name.trim().length < 2) {
      setErrors((prev) => ({ ...prev, name: "El nombre debe tener al menos 2 caracteres." }));
      return;
    }

    setLoading(true);
    try {
      const result = await apiClient.patch<UserDetailsDto>("api/auth/me", {
        name: form.name.trim(),
      });

      if (result.errors) {
        result.errors.forEach((err) => {
          if (err.field.toLowerCase() === "name") {
            setErrors((prev) => ({ ...prev, name: err.message }));
          }
        });
        return;
      }

      if (result.error) {
        setErrors((prev) => ({ ...prev, general: result.error || "Ocurrió un error inesperado." }));
        return;
      }

      toast.success({ text: "Nombre actualizado exitosamente." });
      setEditing(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error({ text: "Ocurrió un error de red." });
    } finally {
      setLoading(false);
    }
  };

  return { editing, setEditing, form, errors, loading, handleChange, handleCancel, handleSubmit };
}
