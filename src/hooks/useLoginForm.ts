import { useState } from "react";
import { toast } from "@pheralb/toast";
import { navigate } from "astro:transitions/client";
import { validatePassword } from "../lib/validatePassword";
import type { UserDto } from "../types/user";

const initialForm = { email: "", password: "" };
const initialErrors = { email: "", password: "", general: "" };

export function useLoginForm() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(initialErrors);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors(initialErrors); // limpia errores previos en cada intento

    try {
      if (!validatePassword(form.password)) {
        setErrors(prev => ({
          ...prev,
          password: "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número",
        }));
        return;
      }

      const res = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });

      const data = (await res.json()) as ApiResponse<UserDto>;

      if (res.status === 400 && data.errors) {
        data.errors.forEach((err: Error) => {
          const field = err.field.toLowerCase() as "email" | "password";
          if (field === "email" || field === "password") {
            setErrors(prev => ({ ...prev, [field]: err.message }));
          }
        });
        return;
      }

      if (!res.ok || !data.success) {
        setErrors(prev => ({
          ...prev,
          general: data.message || (res.status === 401 ? "Credenciales incorrectas" : "Ocurrió un error inesperado"),
        }));
        return;
      }

      toast.success({ text: data.message || "Inicio de sesión exitoso" });
      setForm(initialForm);
      navigate("/");
    } catch (e) {
      console.error(e);
      toast.error({ text: "Ocurrió un error de red" });
    } finally {
      setLoading(false);
    }
  };

  return { form, loading, errors, handleChange, handleSubmit };
}
