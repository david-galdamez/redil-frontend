import { useNameForm } from "../../hooks/useNameForm";
import type { UserDetailsDto } from "../../types/user";

interface Props {
    user: UserDetailsDto;
    apiUrl: string;
}

export default function EditNameCard({ user, apiUrl }: Props) {
    const { editing, setEditing, form, errors, loading, handleChange, handleCancel, handleSubmit } =
        useNameForm(user, apiUrl);

    return (
        <div className="page-card space-y-4">
            <h2 className="font-semibold text-base">Cambiar nombre</h2>
            <div className="field-group">
                <label className="label-base">Nombre</label>
                <input
                    className="input-base"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    disabled={!editing}
                    placeholder="Tu nombre completo"
                />
                {errors.name && <p className="error-text">{errors.name}</p>}
                {errors.general && <p className="error-text">{errors.general}</p>}
            </div>
            <div className="actions-row">
                {!editing ? (
                    <button className="btn-primary" onClick={() => setEditing(true)}>Editar</button>
                ) : (
                    <>
                        <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
                            {loading ? "Guardando..." : "Guardar"}
                        </button>
                        <button className="btn-secondary" onClick={handleCancel}>Cancelar</button>
                    </>
                )}
            </div>
        </div>
    );
}