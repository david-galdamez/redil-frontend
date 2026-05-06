import { useState } from "react";
import { toast } from "@pheralb/toast";
import { validatePassword } from "../lib/validatePassword";

const initialForm = { currentPassword: "", newPassword: "", confirmPassword: "" };
const initialErrors = { currentPassword: "", newPassword: "", confirmPassword: "", general: "" };

export function usePasswordForm(apiUrl: string) {
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState(initialErrors);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleCancel = () => {
        setForm(initialForm);
        setErrors(initialErrors);
        setEditing(false);
    };

    const handleSubmit = async () => {
        setErrors(initialErrors);

        const newErrors = { ...initialErrors };
        let valid = true;

        if (!form.currentPassword) {
            newErrors.currentPassword = "Ingresa tu contraseña actual.";
            valid = false;
        }
        if (!validatePassword(form.newPassword)) {
            newErrors.newPassword = "La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y caracteres especiales.";
            valid = false;
        }
        if (form.newPassword !== form.confirmPassword) {
            newErrors.confirmPassword = "Las contraseñas no coinciden.";
            valid = false;
        }
        if (!valid) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${apiUrl}/api/auth/me/password`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    currentPassword: form.currentPassword,
                    newPassword: form.newPassword,
                }),
            });

            const resData = (await res.json()) as ApiResponse<null>;

            if (res.status === 400 && resData.errors) {
                resData.errors.forEach((err: Error) => {
                    const field = err.field.toLowerCase();
                    if (field === "currentpassword") {
                        setErrors(prev => ({ ...prev, currentPassword: err.message }));
                    }
                    if (field === "newpassword") {
                        setErrors(prev => ({ ...prev, newPassword: err.message }));
                    }
                });
                return;
            }

            if (!res.ok || !resData.success) {
                setErrors(prev => ({ ...prev, general: resData.message || "Ocurrió un error inesperado." }));
                return;
            }

            toast.success({ text: resData.message || "Contraseña actualizada exitosamente." });
            handleCancel();
        } catch (err) {
            console.error(err);
            toast.error({ text: "Ocurrió un error de red." });
        } finally {
            setLoading(false);
        }
    };

    return { editing, setEditing, form, errors, loading, handleChange, handleCancel, handleSubmit };
}