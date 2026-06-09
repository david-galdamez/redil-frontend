import { usePasswordForm } from "../../hooks/usePasswordForm";

export default function EditPasswordCard() {
  const { editing, setEditing, form, errors, loading, handleChange, handleCancel, handleSubmit } =
    usePasswordForm();

  const fields = [
    { name: "currentPassword", label: "Contraseña actual", placeholder: "••••••••", autoComplete: "current-password" },
    { name: "newPassword", label: "Nueva contraseña", placeholder: "Mínimo 8 caracteres", autoComplete: "new-password" },
    { name: "confirmPassword", label: "Confirmar contraseña", placeholder: "Repite la nueva contraseña", autoComplete: "new-password" },
  ] as const;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
      <div className="flex items-center gap-2 mb-2">
        <i className="ti ti-lock text-xl text-[#003366]"></i>
        <h2 className="font-bold text-lg text-[#003366]">Seguridad de la cuenta</h2>
      </div>

      {fields.map(({ name, label, placeholder, autoComplete }) => (
        <div className="flex flex-col gap-1.5" key={name}>
          <label className="text-sm font-semibold text-gray-700">{label}</label>
          <input
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#003366] focus:bg-white transition-colors text-gray-800 disabled:opacity-75 disabled:cursor-not-allowed"
            name={name}
            type="password"
            value={form[name as keyof typeof form]}
            onChange={handleChange}
            disabled={!editing}
            placeholder={placeholder}
            autoComplete={autoComplete}
          />
          {errors[name as keyof typeof errors] && (
            <p className="text-xs font-medium text-red-600 mt-1">{errors[name as keyof typeof errors]}</p>
          )}
        </div>
      ))}

      {errors.general && (
        <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
          <p className="text-xs font-medium text-red-600 text-center">{errors.general}</p>
        </div>
      )}

      <div className="pt-2 flex flex-wrap gap-3">
        {!editing ? (
          <button
            className="bg-white border border-gray-200 hover:bg-gray-50 text-[#003366] font-medium py-2 px-5 rounded-xl text-sm transition-colors flex items-center gap-2"
            onClick={() => setEditing(true)}
          >
            Cambiar contraseña
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
          </button>
        ) : (
          <>
            <button
              className="bg-[#003366] hover:bg-[#002244] text-white font-medium py-2 px-6 rounded-xl text-sm shadow-sm transition-colors disabled:opacity-50"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Actualizando..." : "Actualizar contraseña"}
            </button>
            <button
              className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 font-medium py-2 px-5 rounded-xl text-sm transition-colors"
              onClick={handleCancel}
            >
              Cancelar
            </button>
          </>
        )}
      </div>
    </div>
  );
}
