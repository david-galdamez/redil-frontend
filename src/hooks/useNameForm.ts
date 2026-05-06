import { useState, useEffect } from "react";
import { toast } from "@pheralb/toast";
import type { UserDetailsDto } from "../types/user";

const initialErrors = { name: "", general: "" };

export function useNameForm(user: UserDetailsDto, apiUrl: string) {
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ name: user.name });
    const [errors, setErrors] = useState(initialErrors);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setForm({ name: user.name });
        setErrors(initialErrors);
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ name: e.target.value });
    };

    const handleCancel = () => {
        setForm({ name: user.name });
        setErrors(initialErrors);
        setEditing(false);
    };

    const handleSubmit = async () => {
        setErrors(initialErrors);

        if (form.name.trim().length < 2) {
            setErrors(prev => ({ ...prev, name: "El nombre debe tener al menos 2 caracteres." }));
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${apiUrl}/api/auth/me`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ name: form.name.trim() }),
            });

            const resData = (await res.json()) as ApiResponse<UserDetailsDto>;

            if (res.status === 400 && resData.errors) {
                resData.errors.forEach((err: Error) => {
                    if (err.field.toLowerCase() === "name") {
                        setErrors(prev => ({ ...prev, name: err.message }));
                    }
                });
                return;
            }

            if (!res.ok || !resData.success) {
                setErrors(prev => ({ ...prev, general: resData.message || "Ocurrió un error inesperado." }));
                return;
            }

            toast.success({ text: resData.message || "Nombre actualizado exitosamente." });
            setEditing(false);
            window.location.reload();
        } catch (err) {
            console.error(err);
            toast.error({ text: "Ocurrió un error de red." });
        } finally {
            setLoading(false);
        }
    };

    return { editing, setEditing, form, errors, loading, handleChange, handleCancel, handleSubmit };
}