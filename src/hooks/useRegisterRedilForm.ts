import { useState } from "react";
import { toast } from "@pheralb/toast";
import { navigate } from "astro/virtual-modules/transitions-router.js";
import { apiClient } from "../lib/api/client";

const initialForm = { name: "", description: "" };
const initialErrors = { name: "", description: "", general: "" };

export function useRegisterRedilForm() {
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
      const result = await apiClient.post<RedilDto>("api/redil", form);

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

      toast.success({ text: "Registro exitoso" });
      navigate("/redil");
      setForm(initialForm);
    } catch (e) {
      console.error("Error registering redil:", e);
      toast.error({ text: "Ocurrió un error de red" });
    } finally {
      setLoading(false);
    }
  };

  return { form, loading, errors, handleChange, handleSubmit };
}
