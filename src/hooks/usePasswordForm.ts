import { useState } from "react";
import { toast } from "@pheralb/toast";
import { validatePassword } from "../lib/validatePassword";
import { apiClient } from "../lib/api/client";

const initialForm = { currentPassword: "", newPassword: "", confirmPassword: "" };
const initialErrors = { currentPassword: "", newPassword: "", confirmPassword: "", general: "" };

export function usePasswordForm() {
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

    const newErrors = { ...initialErrors };
    let valid = true;

    if (!form.currentPassword) {
      newErrors.currentPassword = "Ingresa tu contraseña actual.";
      valid = false;
    }
    if (!validatePassword(form.newPassword)) {
      newErrors.newPassword =
        "La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y caracteres especiales.";
      valid = false;
    }
    if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden.";
      valid = false;
    }
    if (!valid) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const result = await apiClient.patch<null>("api/auth/me/password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      if (result.errors) {
        result.errors.forEach((err) => {
          const field = err.field.toLowerCase();
          if (field === "currentpassword") {
            setErrors((prev) => ({ ...prev, currentPassword: err.message }));
          }
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
