import { toast } from "@pheralb/toast";
import { useEffect, useState } from "react";

interface Props {
    id: string;
    teacher: TeacherDetailsDto;
    redils: RedilDto[];
    apiUrl: string;
}

export default function TeacherDetails({ id, teacher, redils, apiUrl }: Props) {

    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        name: teacher.name,
        email: teacher.email,
        redilId: teacher.redilId,
        active: teacher.active
    });
    const [errors, setErrors] = useState({
        name: "",
        email: "",
        general: ""
    })
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setForm({
            name: teacher.name,
            email: teacher.email,
            redilId: teacher.redilId,
            active: teacher.active
        });

        setErrors({
            name: "",
            email: "",
            general: ""
        });
    }, [teacher]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {

        const { name, value, type } = e.target as HTMLInputElement;

        setForm(prev => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? (e.target as HTMLInputElement).checked
                    : name === "redilId"
                        ? (value ? Number(value) : null)
                        : value
        }));
    };

    const handleCancel = () => {
        setForm({
            name: teacher.name,
            email: teacher.email,
            redilId: teacher.redilId,
            active: teacher.active
        });

        setEditing(false);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {

            const res = await fetch(`${apiUrl}/api/teacher/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    ...form,
                    isActive: form.active
                })
            });

            const resData = (await res.json()) as ApiResponse<TeacherDetailsDto>;

            if (res.status === 400 && resData.errors) {
                resData.errors.forEach((err: Error) => {
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

            if (!res.ok || !resData.success) {
                setErrors(prev => ({
                    ...prev,
                    general: resData.message || "Ocurrió un error inesperado"
                }));
                return;
            }

            toast.success({
                text: resData.message || "Profesor actualizado exitosamente",
            })

            window.location.reload();
            setEditing(false);
        } catch (err) {
            console.error(err);
            toast.error({
                text: "Ocurrio un error de red"
            })
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="page-shell">
            <header className="page-header">
                <h1 className="page-title">Detalles del profesor</h1>
                <p className="page-subtitle">Administra sus datos y estado de actividad.</p>
            </header>
            <div className="page-card space-y-4">
                <div className="field-group">
                    <label className="label-base">Nombre</label>
                    <input className="input-base" name="name" value={form.name} onChange={handleChange} disabled={!editing} />
                    {errors.name && <p className="error-text">{errors.name}</p>}
                </div>
                <div className="field-group">
                    <label className="label-base">Email</label>
                    <input className="input-base" name="email" value={form.email} onChange={handleChange} disabled={!editing} />
                    {errors.email && <p className="error-text">{errors.email}</p>}
                </div>
                <div className="field-group">
                    <label className="label-base">Redil asignado</label>
                    <select className="input-base" name="redilId" value={form.redilId ?? ""} onChange={handleChange} disabled={!editing}>
                        <option value="">Seleccionar Redil</option>
                        {redils.map(r => (
                            <option key={r.id} value={r.id}>
                                {r.name}
                            </option>
                        ))}
                    </select>
                </div>
                <label className="inline-flex items-center gap-3 text-sm text-slate-700">
                    <input className="checkbox-base" name="active" type="checkbox" checked={form.active} onChange={handleChange} disabled={!editing} />
                    Activo
                </label>
                {errors.general && <p className="error-text">{errors.general}</p>}
                <div className="actions-row">
                    {!editing && (
                        <button className="btn-primary" onClick={() => setEditing(true)}>
                            Editar
                        </button>
                    )}
                    {editing && (
                        <>
                            <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
                                {loading ? "Guardando..." : "Guardar"}
                            </button>
                            <button className="btn-secondary" onClick={handleCancel}>
                                Cancelar
                            </button>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}