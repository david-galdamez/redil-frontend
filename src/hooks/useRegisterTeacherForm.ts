import { useState } from "react";
import { toast } from "@pheralb/toast";
import { validatePassword } from "../lib/validatePassword";
import { navigate } from "astro/virtual-modules/transitions-router.js";

const initialForm = { name: "", email: "", password: "", redilId: 0 };
const initialErrors = { name: "", email: "", password: "", redilId: "", general: "" };

const VALIDATED_FIELDS = ["name", "email", "password", "redilid"] as const;
type ValidatedField = "name" | "email" | "password" | "redilId";

export function useRegisterTeacherForm(apiUrl: string) {
    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(initialErrors);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setErrors(initialErrors);

        try {
            if (!validatePassword(form.password)) {
                setErrors(prev => ({
                    ...prev,
                    password: "La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y caracteres especiales.",
                }));
                return;
            }

            const res = await fetch(`${apiUrl}/api/teacher`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(form),
            });

            const data = (await res.json()) as ApiResponse<RedilDto>;

            if (res.status === 400 && data.errors) {
                data.errors.forEach((err: Error) => {
                    // La API devuelve "redilId" pero toLowerCase da "redilid"
                    const field = (err.field === "redilId" ? "redilId" : err.field.toLowerCase()) as ValidatedField;
                    if (VALIDATED_FIELDS.includes(field as typeof VALIDATED_FIELDS[number])) {
                        setErrors(prev => ({ ...prev, [field]: err.message }));
                    }
                });
                return;
            }

            if (!res.ok || !data.success) {
                setErrors(prev => ({ ...prev, general: data.message || "Ocurrió un error inesperado" }));
                return;
            }

            toast.success({ text: data.message || "Registro exitoso" });
            navigate("/teacher");
            setForm(initialForm);
        } catch (e) {
            console.error("Error registering teacher:", e);
            toast.error({ text: "Error al registrar el profesor. Por favor, inténtelo de nuevo." });
        } finally {
            setLoading(false);
        }
    };

    return { form, loading, errors, handleChange, handleSubmit };
}