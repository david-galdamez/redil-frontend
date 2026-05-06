import { useRegisterClassForm } from "../../hooks/useRegisterClassForm";

interface Props {
    apiUrl: string;
}

export default function RegisterClassForm({ apiUrl }: Props) {
    const { form, loading, errors, handleChange, handleSubmit } = useRegisterClassForm(apiUrl);

    return (
        <form className="form-card form-card-compact form-grid" onSubmit={handleSubmit}>
            <div className="field-group">
                <label className="label-base" htmlFor="date">Fecha de la clase</label>
                <input
                    className="input-base"
                    type="datetime-local"
                    name="date"
                    id="date"
                    required
                    value={form.date}
                    onChange={handleChange}
                />
                {errors.date && <p className="error-text">{errors.date}</p>}
            </div>

            <div className="field-group">
                <label className="label-base" htmlFor="description">Descripción de la clase</label>
                <textarea
                    className="input-base min-h-28"
                    name="description"
                    id="description"
                    required
                    value={form.description}
                    onChange={handleChange}
                />
                {errors.description && <p className="error-text">{errors.description}</p>}
            </div>

            {errors.general && <p className="error-text">{errors.general}</p>}

            <button className="btn-primary w-full sm:w-fit" disabled={loading} type="submit">
                {loading ? "Registrando..." : "Registrar clase"}
            </button>
        </form>
    );
}