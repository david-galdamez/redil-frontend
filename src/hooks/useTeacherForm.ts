import { useState, useEffect } from "react";
import { toast } from "@pheralb/toast";
import { apiClient } from "../lib/api/client";

const initialErrors = { name: "", email: "", general: "" };

export function useTeacherForm(id: string, teacher: TeacherDetailsDto) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: teacher.name,
    email: teacher.email,
    redilId: teacher.redilId,
    active: teacher.active,
  });
  const [errors, setErrors] = useState(initialErrors);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm({
      name: teacher.name,
      email: teacher.email,
      redilId: teacher.redilId,
      active: teacher.active,
    });
    setErrors(initialErrors);
  }, [teacher]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setForm(prev => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : name === "redilId"
            ? (value ? Number(value) : null)
            : value,
    }));
  };

  const handleCancel = () => {
    setForm({
      name: teacher.name,
      email: teacher.email,
      redilId: teacher.redilId,
      active: teacher.active,
    });
    setErrors(initialErrors);
    setEditing(false);
  };

  const handleSubmit = async () => {
    setErrors(initialErrors);
    setLoading(true);
    try {
      const result = await apiClient.put<TeacherDetailsDto>(`api/teacher/${id}`, { ...form, isActive: form.active });

      if (result.errors) {
        result.errors.forEach((err) => {
          const field = err.field.toLowerCase() as "name" | "email";
          if (field === "name" || field === "email") {
            setErrors(prev => ({ ...prev, [field]: err.message }));
          }
        });
        return;
      }

      if (result.error) {
        setErrors(prev => ({ ...prev, general: result.error || "Ocurrió un error inesperado" }));
        return;
      }

      toast.success({ text: "Profesor actualizado exitosamente" });
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
