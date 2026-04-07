import { toast } from "@pheralb/toast";
import { useEffect, useState } from "react";
import { copyToClipboard } from "../lib/copyToClipboard";
import StudentsTab from "./StudentsTab";

interface Props {
    id: string;
    redil: RedilDetailsDto;
    apiUrl: string;
}

enum Tabs {
    Teachers,
    Students
}

export default function RedilDetails({ id, redil, apiUrl }: Props) {

    const redilLink = `${window.location.origin}/redil/student/${redil.redilCode}`

    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        name: redil.name,
        description: redil.description,
    });
    const [errors, setErrors] = useState({
        name: "",
        description: "",
        general: ""
    })
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(Tabs.Teachers)

    useEffect(() => {
        setForm({
            name: redil.name,
            description: redil.description,
        });

        setErrors({
            name: "",
            description: "",
            general: ""
        });
    }, [redil]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {

        const { name, value } = e.target as HTMLInputElement;

        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCancel = () => {
        setForm({
            name: redil.name,
            description: redil.description,
        });

        setEditing(false);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {

            const res = await fetch(`${apiUrl}/api/redil/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(form)
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
                    if (err.field.toLowerCase() === "description") {
                        setErrors(prev => ({
                            ...prev,
                            description: err.message,
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
                text: resData.message || "Redil actualizada exitosamente",
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
                <h1 className="page-title">Detalles de la redil</h1>
                <p className="page-subtitle">Consulta y edita la informacion principal de la redil.</p>
            </header>

            <div className="page-card space-y-4">
                <div className="field-group">
                    <label className="label-base">Nombre</label>
                    <input
                        className="input-base"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        disabled={!editing}
                    />
                    {
                        errors.name && <p className="error-text">{errors.name}</p>
                    }
                </div>
                <div className="field-group">

                    <label className="label-base">Descripcion</label>
                    <textarea
                        className="input-base min-h-24"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        disabled={!editing}
                    />
                    {
                        errors.description && <p className="error-text">{errors.description}</p>
                    }
                </div>
                <div className="space-y-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <p><strong>Link de asistencia:</strong></p>

                    <input
                        className="input-base"
                        type="text"
                        value={redilLink}
                        readOnly
                    />

                    <div className="actions-row pt-0!">
                        <button className="btn-secondary" onClick={() => window.open(redilLink, "_blank")}>
                            Abrir
                        </button>

                        <button className="btn-primary" onClick={() => copyToClipboard(redilLink)}>
                            Copiar link
                        </button>
                    </div>
                </div>
                {errors.general && <p className="error-text">{errors.general}</p>}
                <div className="space-y-3">
                    <div className="flex border-b border-slate-200">
                        <button
                            className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === Tabs.Teachers
                                ? "border-b-2 border-blue-500 text-blue-600"
                                : "text-slate-500 hover:text-slate-700"
                                }`}
                            onClick={() => setActiveTab(Tabs.Teachers)}
                        >
                            Profesores
                        </button>
                        <button
                            className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === Tabs.Students
                                ? "border-b-2 border-blue-500 text-blue-600"
                                : "text-slate-500 hover:text-slate-700"
                                }`}
                            onClick={() => setActiveTab(Tabs.Students)}
                        >
                            Estudiantes
                        </button>
                    </div>

                    {/* Tab content */}
                    <div className="pt-1">
                        {activeTab === Tabs.Teachers && (
                            redil.teacherList.length > 0 ? (
                                <div className="overflow-x-auto rounded-lg border border-slate-200">
                                    <table className="min-w-full divide-y divide-slate-200 text-sm">
                                        <thead className="bg-slate-100">
                                            <tr>
                                                <th className="px-4 py-2 text-left font-medium text-slate-700">Nombre</th>
                                                <th className="px-4 py-2 text-left font-medium text-slate-700">Email</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 bg-white">
                                            {redil.teacherList.map((t) => (
                                                <tr key={t.id}>
                                                    <td className="px-4 py-2">{t.name}</td>
                                                    <td className="px-4 py-2 break-all">{t.email}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-sm text-slate-600">No hay profesores asignados a esta redil.</p>
                            )
                        )}

                        {activeTab === Tabs.Students && (
                            <StudentsTab redilId={id} apiUrl={apiUrl} />
                        )}
                    </div>
                </div>
                <div className="actions-row">
                    {!editing && (
                        <button className="btn-primary" onClick={() => setEditing(true)}>
                            Editar
                        </button>
                    )}
                    {editing && (
                        <>
                            <button
                                className="btn-primary"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? "Guardando..." : "Guardar"}
                            </button>

                            <button
                                className="btn-secondary"
                                onClick={handleCancel}
                            >
                                Cancelar
                            </button>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}