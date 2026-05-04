import { toast } from "@pheralb/toast";
import { navigate } from "astro/virtual-modules/transitions-router.js";
import { useState } from "react";

interface Props {
    apiUrl: string;
}

export default function RegisterClassForm({ apiUrl }: Props) {

    const [form, setForm] = useState({
        date: "",
        description: "",
    })
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        date: "",
        description: "",
        general: ""
    });

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

            const payload = {
                ...form,
                date: new Date(form.date).toISOString()
            }

            const res = await fetch(`${apiUrl}/api/class/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
                credentials: "include"
            })

            const data = (await res.json()) as ApiResponse<RegisterClassResponse>;

            if (res.status === 400 && data.errors) {
                data.errors.forEach((err: Error) => {
                    if (err.field.toLowerCase() === "date") {
                        setErrors(prev => ({
                            ...prev,
                            date: err.message,
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
                text: data.message || "Registro de clase exitoso",
            })
            navigate(`/class/${data.data?.id}`)
            setForm({
                date: "",
                description: "",
            })
            setErrors({
                date: "",
                description: "",
                general: "",
            })
        } catch (err) {
            console.error(err)
            toast.error({
                text: "Ocurrió un error de red",
            })
        } finally {
            setLoading(false);
        }
    }

    return (
        <form className="form-card form-card-compact form-grid" onSubmit={handleSubmit}>
            <div className="field-group">
                <label className="label-base" htmlFor="date">Fecha de la clase</label>
                <input className="input-base" type="datetime-local" name="date" id="date" required value={form.date} onChange={handleChange} />
                {errors.date && <p className="error-text">{errors.date}</p>}
            </div>

            <div className="field-group">
                <label className="label-base" htmlFor="description">Descripción de la clase</label>
                <textarea className="input-base min-h-28" name="description" id="description" required value={form.description} onChange={handleChange}></textarea>
                {errors.description && <p className="error-text">{errors.description}</p>}
            </div>

            {errors.general && <p className="error-text">{errors.general}</p>}

            <button className="btn-primary w-full sm:w-fit" disabled={loading} type="submit">
                {loading ? "Registrando..." : "Registrar clase"}
            </button>
        </form>
    )
}