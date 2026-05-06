import { useLoginForm } from "../hooks/useLoginForm";

interface Props {
    apiUrl: string;
}

export default function LoginForm({ apiUrl }: Props) {
    const { form, loading, errors, handleChange, handleSubmit } = useLoginForm(apiUrl);

    return (
        <form className="form-card form-grid w-full max-w-md" onSubmit={handleSubmit}>
            <div className="field-group">
                <label className="label-base" htmlFor="email">Correo</label>
                <input
                    className="input-base"
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                />
                {errors.email && <p className="error-text">{errors.email}</p>}
            </div>

            <div className="field-group">
                <label className="label-base" htmlFor="password">Contraseña</label>
                <input
                    className="input-base"
                    type="password"
                    id="password"
                    name="password"
                    required
                    value={form.password}
                    onChange={handleChange}
                />
                {errors.password && <p className="error-text">{errors.password}</p>}
            </div>

            {errors.general && <p className="error-text">{errors.general}</p>}

            <button className="btn-primary w-full" type="submit" disabled={loading}>
                {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
        </form>
    );
}