import { useState } from "react";
import { toast } from "@pheralb/toast";

const initialForm = { name: "", description: "" };
const initialErrors = { name: "", description: "", general: "" };

export function useRegisterRedilForm(apiUrl: string) {
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
            const res = await fetch(`${apiUrl}/api/redil`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(form),
            });

            const data = (await res.json()) as ApiResponse<RedilDto>;

            if (res.status === 400 && data.errors) {
                data.errors.forEach((err: Error) => {
                    const field = err.field.toLowerCase() as "name" | "description";
                    if (field === "name" || field === "description") {
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