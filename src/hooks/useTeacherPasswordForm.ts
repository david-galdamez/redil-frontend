import { useState } from "react";
import { toast } from "@pheralb/toast";
import { validatePassword } from "../lib/validatePassword";
import { apiClient } from "../lib/api/client";

const initialForm = { newPassword: "" };
const initialErrors = { newPassword: "", general: "" };

export function useTeacherPasswordForm(teacherId: string) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState(initialErrors);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setForm(initialForm);
    setErrors(initialErrors);
    setEditing(false);
  };

  const handleSubmit = async () => {
    setErrors(initialErrors);
    setLoading(true);
    try {
      if (!validatePassword(form.newPassword)) {
        setErrors((prev) => ({
          ...prev,
          newPassword:
            "La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas y números.",
        }));
        setLoading(false);
        return;
      }

      const result = await apiClient.patch<null>(`api/teacher/${teacherId}/password`, {
        newPassword: form.newPassword,
      });

      if (result.errors) {
        result.errors.forEach((err) => {
          const field = err.field.toLowerCase();
          if (field === "newpassword") {
            setErrors((prev) => ({ ...prev, newPassword: err.message }));
          }
        });
        return;
      }

      if (result.error) {
        setErrors((prev) => ({ ...prev, general: result.error || "Ocurrió un error inesperado." }));
        return;
      }

      toast.success({ text: "Contraseña actualizada exitosamente." });
      handleCancel();
    } catch (err) {
      console.error(err);
      toast.error({ text: "Ocurrió un error de red." });
    } finally {
      setLoading(false);
    }
  };

  return { editing, setEditing, form, errors, loading, handleChange, handleCancel, handleSubmit };
}
