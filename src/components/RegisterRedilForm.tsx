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
            const res = await fetch(`${apiUrl}/api/redil`, {
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
        <form className="form-card form-card-compact form-grid" onSubmit={handleSubmit}>
            <div className="field-group">
                <label className="label-base" htmlFor="name">Nombre del redil</label>
                <input className="input-base" type="text" id="name" name="name" required value={form.name} onChange={handleChange} />
                {errors.name && <p className="error-text">{errors.name}</p>}
            </div>

            <div className="field-group">
                <label className="label-base" htmlFor="description">Descripción</label>
                <textarea className="input-base min-h-28" id="description" name="description" required value={form.description} onChange={handleChange}></textarea>
                {errors.description && <p className="error-text">{errors.description}</p>}
            </div>

            {errors.general && <p className="error-text">{errors.general}</p>}

            <button className="btn-primary w-full sm:w-fit" type="submit" disabled={loading}>
                {loading ? "Registrando..." : "Registrar redil"}
            </button>
        </form>
    )
}