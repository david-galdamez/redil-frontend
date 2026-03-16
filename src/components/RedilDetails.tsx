import { toast } from "@pheralb/toast";
import { useEffect, useState } from "react";

interface Props {
    id: string;
    redil: RedilDetailsDto;
    apiUrl: string;
}

export default function RedilDetails({ id, redil, apiUrl }: Props) {

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

        <div>
            <h1>Detalles de la Redil</h1>
            <div>
                <label>Nombre</label>
                <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    disabled={!editing}
                />
            </div>
            <div>

                <label>Descripción</label>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    disabled={!editing}
                />
            </div>
            <div>
                {
                    redil.teacherList.length > 0 ? (
                        <>
                            <label>Profesores</label>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Email</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {redil.teacherList.map(t => (
                                        <tr key={t.id}>
                                            <td>{t.name}</td>
                                            <td>{t.email}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )
                        :
                        (
                            <label>No hay profesores asignados a esta redil</label>
                        )
                }
            </div>
            {!editing && (
                <button onClick={() => setEditing(true)}>
                    Editar
                </button>
            )}
            {editing && (
                <>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Guardando..." : "Guardar"}
                    </button>

                    <button
                        onClick={handleCancel}
                    >
                        Cancelar
                    </button>
                </>
            )}
        </div>
    );
}