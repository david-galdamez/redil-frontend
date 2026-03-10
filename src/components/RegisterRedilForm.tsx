import { toast } from "@pheralb/toast";
import { useState } from "react"

interface Props {
    apiUrl: string;
}

export default function RegisterRedilForm({ apiUrl }: Props) {

    const [form, setForm] = useState({
        name: "",
        description: ""
    })
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({
        name: "",
        description: "",
        general: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${apiUrl}/api/redil/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
                credentials: "include"
            })

            const data = (await res.json()) as ApiResponse<RedilDto>;

            if (res.status === 400 && data.errors) {
                data.errors.forEach((err: Error) => {
                    if (err.field.toLowerCase() === "name") {
                        setErrors(prev => ({
                            ...prev,
                            name: err.message,
                        }))
                    }
                    if (err.field.toLowerCase() === "description") {
                        setErrors(prev => ({
                            ...prev,
                            description: err.message,
                        }))
                    }
                });
                return;
            }

            if (!res.ok || !data.success) {
                setErrors(prev => ({
                    ...prev,
                    general: data.message || "Ocurrió un error inesperado"
                }));
                return;
            }

            toast.success({
                text: data.message || "Registro exitoso",
            })
            setForm({
                name: "",
                description: "",
            })
            setErrors({
                name: "",
                description: "",
                general: "",
            })
        } catch (e) {
            console.error("Error registering redil:", e);
            toast.error({
                text: "Ocurrio un error de red"
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="name">Nombre del redil: </label>
            <input type="text" id="name" name="name" required value={form.name} onChange={handleChange} />
            {errors.name && <p className="error">{errors.name}</p>}

            <label htmlFor="description">Descripción: </label>
            <textarea id="description" name="description" required value={form.description} onChange={handleChange}></textarea>
            {errors.description && <p className="error">{errors.description}</p>}

            <button type="submit" disabled={loading}>
                {loading ? "Registrando..." : "Registrar Redil"}
            </button>
            {errors.general && <p className="error">{errors.general}</p>}
        </form>
    )
}