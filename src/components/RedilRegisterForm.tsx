import React, { useState } from "react";
import { toast } from "@pheralb/toast";

interface Props {
    redilCode: string,
    apiUrl: string,
    groups: GroupDto[],
}

export default function RedilRegisterForm({ redilCode, apiUrl, groups }: Props) {

    const [form, setForm] = useState({
        name: "",
        email: "",
        isServer: false,
        groupId: "",
    })
    const [errors, setErrors] = useState({
        name: "",
        email: "",
        general: "",
    })
    const [loading, setLoading] = useState(false);

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? (value === "on") : value,
        }))
    }

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({
            name: "",
            email: "",
            general: "",
        })
        setLoading(true);
        try {
            const res = await fetch(
                `${apiUrl}/api/student/register/${redilCode}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(form),
                },
            );

            const data = (await res.json()) as ApiResponse<number>;

            if (res.status === 400 && data.errors) {
                data.errors.forEach((err: Error) => {
                    if (err.field.toLowerCase() === "name") {
                        setErrors(prev => ({
                            ...prev,
                            name: err.message,
                        }))
                    }
                    if (err.field.toLowerCase() === "email") {
                        setErrors(prev => ({
                            ...prev,
                            email: err.message,
                        }))
                    }
                });
                return;
            }

            if (!res.ok || !data.success) {
                toast.error({
                    text: data.message || "Ocurrió un error desconocido",
                })
                return;
            }

            toast.success({
                text: data.message || "Inscripción exitosa",
            });
            setForm({
                name: "",
                email: "",
                isServer: false,
                groupId: "",
            })
        } catch (e) {
            console.error("Error submitting form:", e);
            toast.error({
                text: "Ocurrió un errror de conexión",
            })
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="name">Nombre:</label>
            <input type="text" id="name" name="name" value={form.name} onChange={onChange} required />
            {
                errors.name && <small className="error">{errors.name}</small>
            }

            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" value={form.email} onChange={onChange} required />
            {
                errors.email && <small className="error">{errors.email}</small>
            }

            <label htmlFor="isServer">Es servidor:</label>
            <input type="checkbox" id="isServer" name="isServer" checked={form.isServer} onChange={onChange} />

            <label htmlFor="groupId">Grupo al que asiste:</label>
            <select id="groupId" name="groupId" value={form.groupId} onChange={onChange} required>
                <option value="0">Selecciona un grupo</option>
                {groups?.map((g) => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                ))}
            </select>

            <button type="submit">{loading ? "Inscribiéndose..." : "Inscribirse"}</button>
        </form>
    )
}