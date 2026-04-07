import { toast } from "@pheralb/toast";
import type React from "react";
import { useState } from "react";
import { formatDateLocal, formatDateReadable } from "../lib/formatDate";

interface Props {
    apiUrl: string;
    assistClass: AssisClassDetailDto;
    attendanceToken: string;
}

export default function AssistClassDetails({ apiUrl, assistClass, attendanceToken }: Props) {

    const [form, setForm] = useState({
        email: "",
        attended: false
    })
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({
        email: "",
        general: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch(`${apiUrl}/api/class/assist/register/${attendanceToken}`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(form)
            })

            const data = (await res.json()) as ApiResponse<string>

            if (res.status === 400 && data.errors) {
                data.errors.forEach((err: Error) => {
                    if (err.field.toLowerCase() === "email") {
                        setErrors((prev) => ({
                            ...prev,
                            email: err.message,
                        }));
                    }
                });
                return;
            }

            if (!res.ok || !data.success) {
                setErrors((prev) => ({
                    ...prev,
                    general: data.message || "Ocurrió un error desconocido",
                }));
                return;
            }

            setErrors({
                email: "",
                general: ""
            })
            setForm({
                email: "",
                attended: false
            })
            toast.success({
                text: data.message || "Asistencia registrada con exito",
            });
        } catch (e) {
            console.error("Error registering assist: ", e)
            toast.error({
                text: "Ocurrio un error inesperado"
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="page-shell">
            <header className="page-header">
                <h1 className="page-title">Asistencia - {assistClass.redilName}</h1>
                <p className="page-subtitle">{assistClass.classDescription}</p>
                <p className="text-sm text-slate-500">Clase dada: {formatDateReadable(assistClass.classDate)}</p>
            </header>

            <form className="form-card form-card-compact form-grid" onSubmit={handleSubmit}>
                <div className="field-group">
                    <label className="label-base" htmlFor="email">Correo del estudiante</label>
                    <input className="input-base" type="email" name="email" id="email" required value={form.email} onChange={handleChange} />
                    {errors.email && <p className="error-text">{errors.email}</p>}
                </div>

                <label className="inline-flex items-center gap-3 text-sm text-slate-700" htmlFor="attended">
                    <input className="checkbox-base" type="checkbox" name="attended" id="attended" checked={form.attended} onChange={handleChange} />
                    Asistio a la clase
                </label>

                {errors.general && <p className="error-text">{errors.general}</p>}

                <button className="btn-primary w-full sm:w-fit" type="submit" disabled={loading}>
                    {loading ? "Registrando asistencia..." : "Registrar asistencia"}
                </button>
            </form>
        </section>
    )
}