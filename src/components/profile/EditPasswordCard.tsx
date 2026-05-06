import { usePasswordForm } from "../../hooks/usePasswordForm";

interface Props {
    apiUrl: string;
}

export default function EditPasswordCard({ apiUrl }: Props) {
    const { editing, setEditing, form, errors, loading, handleChange, handleCancel, handleSubmit } =
        usePasswordForm(apiUrl);

    const fields = [
        { name: "currentPassword", label: "Contraseña actual", placeholder: "••••••••", autoComplete: "current-password" },
        { name: "newPassword", label: "Nueva contraseña", placeholder: "Mínimo 8 caracteres", autoComplete: "new-password" },
        { name: "confirmPassword", label: "Confirmar contraseña", placeholder: "Repite la nueva contraseña", autoComplete: "new-password" },
    ] as const;

    return (
        <div className="page-card space-y-4">
            <h2 className="font-semibold text-base">Cambiar contraseña</h2>
            {fields.map(({ name, label, placeholder, autoComplete }) => (
                <div className="field-group" key={name}>
                    <label className="label-base">{label}</label>
                    <input
                        className="input-base"
                        name={name}
                        type="password"
                        value={form[name]}
                        onChange={handleChange}
                        disabled={!editing}
                        placeholder={placeholder}
                        autoComplete={autoComplete}
                    />
                    {errors[name] && <p className="error-text">{errors[name]}</p>}
                </div>
            ))}
            {errors.general && <p className="error-text">{errors.general}</p>}
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