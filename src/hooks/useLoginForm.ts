import { useState } from "react";
import { toast } from "@pheralb/toast";
import { navigate } from "astro:transitions/client";
import { validatePassword } from "../lib/validatePassword";
import type { LoginResponse } from "../types/auth";
import { apiClient } from "../lib/api/client";

const initialForm = { email: "", password: "" };
const initialErrors = { email: "", password: "", general: "" };

function setAuthToken(token: string) {
  localStorage.setItem("auth_token", token);
  document.cookie = `access_token=${token}; path=/; max-age=86400; samesite=lax`;
}

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
    setErrors(initialErrors);

    try {
      if (!validatePassword(form.password)) {
        setErrors(prev => ({
          ...prev,
          password: "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número",
        }));
        return;
      }

      const result = await apiClient.post<LoginResponse>("api/auth/login", form);

      if (result.errors) {
        result.errors.forEach((err) => {
          const field = err.field.toLowerCase() as "email" | "password";
          if (field === "email" || field === "password") {
            setErrors(prev => ({ ...prev, [field]: err.message }));
          }
        });
        return;
      }

      if (result.error) {
        setErrors(prev => ({
          ...prev,
          general: result.error || (result.status === 401 ? "Credenciales incorrectas" : "Ocurrió un error inesperado"),
        }));
        return;
      }

      if (result.data?.accessToken) {
        setAuthToken(result.data.accessToken);
        toast.success({ text: "Inicio de sesión exitoso" });
        setForm(initialForm);
        navigate("/");
      } else {
        toast.error({ text: "No se recibió el token de autenticación del servidor" });
      }
    } catch (e) {
      console.error(e);
      toast.error({ text: "Ocurrió un error de red" });
    } finally {
      setLoading(false);
    }
  };

  return { form, loading, errors, handleChange, handleSubmit };
}
