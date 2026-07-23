import { useState } from "react";
import { toast } from "@pheralb/toast";
import { navigate } from "astro:transitions/client";
import { apiClient } from "../lib/api/client";

const initialForm = { date: "", description: "" };
const initialErrors = { date: "", description: "", general: "" };

export function useRegisterClassForm() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(initialErrors);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors(initialErrors);
    try {
      const result = await apiClient.post<RegisterClassResponse>("api/class/register", {
        ...form,
        date: new Date(form.date).toISOString(),
      });

      if (result.errors) {
        result.errors.forEach((err) => {
          const field = err.field.toLowerCase() as "date" | "description";
          if (field === "date" || field === "description") {
            setErrors(prev => ({ ...prev, [field]: err.message }));
          }
        });
        return;
      }

      if (result.error) {
        setErrors(prev => ({ ...prev, general: result.error || "Ocurrió un error inesperado" }));
        return;
      }

      toast.success({ text: "Registro de clase exitoso" });
      setForm(initialForm);
      navigate(`/class/${result.data?.id}`);
    } catch (err) {
      console.error(err);
      toast.error({ text: "Ocurrió un error de red" });
    } finally {
      setLoading(false);
    }
  };

  return { form, loading, errors, handleChange, handleSubmit };
}
