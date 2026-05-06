import { useRegisterRedilForm } from "../../hooks/useRegisterRedilForm";

interface Props {
    apiUrl: string;
}

export default function RegisterRedilForm({ apiUrl }: Props) {
    const { form, loading, errors, handleChange, handleSubmit } = useRegisterRedilForm(apiUrl);

    return (
        <form className="form-card form-card-compact form-grid" onSubmit={handleSubmit}>
            <div className="field-group">
                <label className="label-base" htmlFor="name">Nombre del redil</label>
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
                <label className="label-base" htmlFor="description">Descripción</label>
                <textarea
                    className="input-base min-h-28"
                    id="description"
                    name="description"
                    required
                    value={form.description}
                    onChange={handleChange}
                />
                {errors.description && <p className="error-text">{errors.description}</p>}
            </div>

            {errors.general && <p className="error-text">{errors.general}</p>}

            <button className="btn-primary w-full sm:w-fit" type="submit" disabled={loading}>
                {loading ? "Registrando..." : "Registrar redil"}
            </button>
        </form>
    );
}