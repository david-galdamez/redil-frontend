import { toast } from "@pheralb/toast";
import { useState } from "react";
import { validatePassword } from "../lib/validatePassword";
import { set } from "astro:schema";

interface Props {
    apiUrl: string;
    rediles: RedilListDto[];
}

export default function RegisterTeacherForm({ apiUrl, rediles }: Props) {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        redilId: 0
    })
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        redilId: "",
        general: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    }

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const validPassword = validatePassword(form.password);
            if (!validPassword) {
                setErrors(prev => ({
                    ...prev,
                    password: "La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y caracteres especiales."
                }));
                return;
            }

            const res = await fetch(`${apiUrl}/api/teacher`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form),
                credentials: 'include'
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
                    if (err.field.toLowerCase() === "email") {
                        setErrors(prev => ({
                            ...prev,
                            email: err.message,
                        }))
                    }
                    if (err.field.toLowerCase() === "password") {
                        setErrors(prev => ({
                            ...prev,
                            password: err.message,
                        }))
                    }
                    if (err.field.toLowerCase() === "redilId") {
                        setErrors(prev => ({
                            ...prev,
                            redilId: err.message,
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
                email: "",
                password: "",
                redilId: 0
            })
            setErrors({
                name: "",
                email: "",
                password: "",
                redilId: "",
                general: "",
            })
        } catch (e) {
            console.error('Error registering teacher:', e);
            toast.error({
                text: 'Error al registrar el profesor. Por favor, inténtelo de nuevo.',
            })
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="name">Nombre: </label>
            <input type="text" id="name" name="name" required value={form.name} onChange={handleChange} />
            {
                errors.name && <p className="error">{errors.name}</p>
            }

            <label htmlFor="email">Correo electronico:</label>
            <input type="email" id="email" name="email" required value={form.email} onChange={handleChange} />
            {
                errors.email && <p className="error">{errors.email}</p>
            }

            <label htmlFor="password">Contraseña:</label>
            <input type="password" id="password" name="password" required value={form.password} onChange={handleChange} />
            {
                errors.password && <p className="error">{errors.password}</p>
            }

            <label htmlFor="redilId">Redil: </label>
            <select name="redilId" id="redilId" required value={form.redilId} onChange={handleChange}>
                <option value="0">Seleccione un redil</option>
                {
                    rediles.map(r => (
                        <option key={r.id} value={r.id}>
                            {r.name}
                        </option>
                    ))
                }
            </select>
            {
                errors.redilId && <p className="error">{errors.redilId}</p>
            }

            {
                errors.general && <p className="error">{errors.general}</p>
            }

            <button type="submit" disabled={loading}>
                {loading ? "Registrando..." : "Registrar"}
            </button>
        </form>
    )
}