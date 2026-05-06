import { useState } from "react";
import { toast } from "@pheralb/toast";
import { navigate } from "astro:transitions/client";

const initialForm = { date: "", description: "" };
const initialErrors = { date: "", description: "", general: "" };

export function useRegisterClassForm(apiUrl: string) {
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
            const res = await fetch(`${apiUrl}/api/class/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ ...form, date: new Date(form.date).toISOString() }),
            });

            const data = (await res.json()) as ApiResponse<RegisterClassResponse>;

            if (res.status === 400 && data.errors) {
                data.errors.forEach((err: Error) => {
                    const field = err.field.toLowerCase() as "date" | "description";
                    if (field === "date" || field === "description") {
                        setErrors(prev => ({ ...prev, [field]: err.message }));
                    }
                });
                return;
            }

            if (!res.ok || !data.success) {
                setErrors(prev => ({ ...prev, general: data.message || "Ocurrió un error inesperado" }));
                return;
            }

            toast.success({ text: data.message || "Registro de clase exitoso" });
            setForm(initialForm);
            navigate(`/class/${data.data?.id}`);
        } catch (err) {
            console.error(err);
            toast.error({ text: "Ocurrió un error de red" });
        } finally {
            setLoading(false);
        }
    };

    return { form, loading, errors, handleChange, handleSubmit };
}