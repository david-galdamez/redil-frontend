import { useState } from "react";
import { toast } from "@pheralb/toast";

const initialForm = { name: "", email: "", isServer: false, groupId: "" };
const initialErrors = { name: "", email: "", groupId: "", general: "" };
const VALIDATED_FIELDS = ["name", "email", "groupid"] as const;

export function useRedilRegisterForm(apiUrl: string, redilCode: string) {
    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(initialErrors);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors(initialErrors);

        if (!form.groupId) {
            setErrors(prev => ({ ...prev, groupId: "Debes seleccionar un grupo" }));
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${apiUrl}/api/student/register/${redilCode}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = (await res.json()) as ApiResponse<number>;

            if (res.status === 400 && data.errors) {
                data.errors.forEach((err: Error) => {
                    const field = err.field.toLowerCase();
                    // La API devuelve "groupId" pero toLowerCase da "groupid"
                    const mapped = field === "groupid" ? "groupId" : field;
                    if (VALIDATED_FIELDS.includes(field as typeof VALIDATED_FIELDS[number])) {
                        setErrors(prev => ({ ...prev, [mapped]: err.message }));
                    }
                });
                return;
            }

            if (!res.ok || !data.success) {
                setErrors(prev => ({ ...prev, general: data.message || "Ocurrió un error desconocido" }));
                return;
            }

            toast.success({ text: data.message || "Inscripción exitosa" });
            setForm(initialForm); // más simple que el flag shouldReset
        } catch (e) {
            console.error("Error submitting form:", e);
            toast.error({ text: "Ocurrió un error de conexión" });
        } finally {
            setLoading(false);
        }
    };

    return { form, loading, errors, handleChange, handleSubmit };
}