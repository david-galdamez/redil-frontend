import { useRegisterTeacherForm } from "../../hooks/useRegisterTeacherForm";

interface Props {
    apiUrl: string;
    rediles: RedilListDto[];
}

export default function RegisterTeacherForm({ apiUrl, rediles }: Props) {
    const { form, loading, errors, handleChange, handleSubmit } = useRegisterTeacherForm(apiUrl);

    return (
        <form className="form-card form-card-compact form-grid" onSubmit={handleSubmit}>
            <div className="field-group">
                <label className="label-base" htmlFor="name">Nombre</label>
                <input
                    className="input-base"
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                />
                {errors.name && <p className="error-text">{errors.name}</p>}
            </div>

            <div className="field-group">
                <label className="label-base" htmlFor="email">Correo electrónico</label>
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

            <div className="field-group">
                <label className="label-base" htmlFor="redilId">Redil</label>
                <select
                    className="input-base"
                    name="redilId"
                    id="redilId"
                    required
                    value={form.redilId}
                    onChange={handleChange}
                >
                    <option value="0">Seleccione un redil</option>
                    {rediles.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                </select>
                {errors.redilId && <p className="error-text">{errors.redilId}</p>}
            </div>

            {errors.general && <p className="error-text">{errors.general}</p>}

            <button className="btn-primary w-full sm:w-fit" type="submit" disabled={loading}>
                {loading ? "Registrando..." : "Registrar"}
            </button>
        </form>
    );
}