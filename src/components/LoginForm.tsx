import { useState } from "react";
import type { UserDto } from "../types/user";
import { toast } from "@pheralb/toast";
import { navigate } from "astro:transitions/client";
import { validatePassword } from "../lib/validatePassword";

interface Props {
    apiUrl: string,
}

export default function LoginForm({ apiUrl }: Props) {

    const [form, setForm] = useState({
        email: "",
        password: "",
    })
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        email: "",
        password: "",
        general: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {

            const validPassword = validatePassword(form.password);
            if (!validPassword) {
                setErrors(prev => ({
                    ...prev,
                    password: "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número",
                }))
                return;
            }

            const res = await fetch(`${apiUrl}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
                credentials: "include",
            })

            const data = (await res.json()) as ApiResponse<UserDto>;

            if (res.status === 400 && data.errors) {
                data.errors.forEach((err: Error) => {
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
                });
                return;
            }

            if (res.status === 401) {
                setErrors(prev => ({
                    ...prev,
                    general: data.message || "Credenciales incorrectas"
                }));
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
                text: data.message || "Inicio de sesión exitoso",
            })
            navigate("/dashboard");
            setForm({
                email: "",
                password: "",
            })
            setErrors({
                email: "",
                password: "",
                general: "",
            })
        } catch (e) {
            console.error(e);
            toast.error({
                text: "Ocurrió un error de red",
            })
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="email">Correo:</label>
                <input type="email" id="email" name="email" required value={form.email} onChange={handleChange} />
                {
                    errors.email && <p className="error">{errors.email}</p>
                }
            </div>

            <div>
                <label htmlFor="password">Contraseña:</label>
                <input type="password" id="password" name="password" required value={form.password} onChange={handleChange} />
                {
                    errors.password && <p className="error">{errors.password}</p>
                }
            </div>

            {errors.general && <p className="error">{errors.general}</p>}

            <button type="submit" disabled={loading}>{loading ? "Iniciando sesión..." : "Iniciar sesión"}</button>
        </form>
    )
}