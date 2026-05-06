import { useState } from "react";
import { toast } from "@pheralb/toast";

export function useAssistForm(apiUrl: string, attendanceToken: string) {
    const [form, setForm] = useState({ email: "", attended: false });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ email: "", general: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const setEmail = (email: string) => setForm(prev => ({ ...prev, email }));

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setErrors({ email: "", general: "" });
        try {
            const res = await fetch(`${apiUrl}/api/class/assist/register/${attendanceToken}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = (await res.json()) as ApiResponse<string>;

            if (res.status === 400 && data.errors) {
                data.errors.forEach((err: Error) => {
                    if (err.field.toLowerCase() === "email") {
                        setErrors(prev => ({ ...prev, email: err.message }));
                    }
                });
                return;
            }

            if (!res.ok || !data.success) {
                setErrors(prev => ({ ...prev, general: data.message || "Ocurrió un error desconocido" }));
                return;
            }

            setForm({ email: "", attended: false });
            toast.success({ text: data.message || "Asistencia registrada con éxito" });
        } catch (err) {
            console.error("Error registering assist:", err);
            toast.error({ text: "Ocurrió un error inesperado" });
        } finally {
            setLoading(false);
        }
    };

    return { form, loading, errors, handleChange, handleSubmit, setEmail };
}