import { useState, useEffect } from "react";
import { toast } from "@pheralb/toast";

const initialErrors = { name: "", description: "", general: "" };

export function useRedilForm(id: string, redil: RedilDetailsDto, apiUrl: string) {
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ name: redil.name, description: redil.description });
    const [errors, setErrors] = useState(initialErrors);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setForm({ name: redil.name, description: redil.description });
        setErrors(initialErrors);
    }, [redil]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleCancel = () => {
        setForm({ name: redil.name, description: redil.description });
        setErrors(initialErrors);
        setEditing(false);
    };

    const handleSubmit = async () => {
        setErrors(initialErrors);
        setLoading(true);
        try {
            const res = await fetch(`${apiUrl}/api/redil/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(form),
            });

            const resData = (await res.json()) as ApiResponse<RedilDetailsDto>;

            if (res.status === 400 && resData.errors) {
                resData.errors.forEach((err: Error) => {
                    const field = err.field.toLowerCase() as "name" | "description";
                    if (field === "name" || field === "description") {
                        setErrors(prev => ({ ...prev, [field]: err.message }));
                    }
                });
                return;
            }

            if (!res.ok || !resData.success) {
                setErrors(prev => ({ ...prev, general: resData.message || "Ocurrió un error inesperado" }));
                return;
            }

            toast.success({ text: resData.message || "Redil actualizada exitosamente" });
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