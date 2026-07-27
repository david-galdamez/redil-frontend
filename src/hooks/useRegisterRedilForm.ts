import { useState } from "react";
import { toast } from "@pheralb/toast";
import { navigate } from "astro/virtual-modules/transitions-router.js";
import { apiClient } from "../lib/api/client";

const initialForm = { name: "", description: "", numCourse: 0 };
const initialErrors = { name: "", description: "", numCourse: "", general: "" };

export function useRegisterRedilForm() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(initialErrors);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "numCourse" ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors(initialErrors);
    try {
      const result = await apiClient.post<RedilDto>("api/redil", form);

      if (result.errors) {
        result.errors.forEach((err) => {
          const field = err.field.toLowerCase();
          if (field === "name") setErrors((prev) => ({ ...prev, name: err.message }));
          else if (field === "description")
            setErrors((prev) => ({ ...prev, description: err.message }));
          else if (field === "numcourse")
            setErrors((prev) => ({ ...prev, numCourse: err.message }));
        });
        return;
      }

      if (result.error) {
        setErrors((prev) => ({ ...prev, general: result.error || "Ocurrió un error inesperado" }));
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
