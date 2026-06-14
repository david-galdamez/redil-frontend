import { useTeacherForm } from "../../hooks/useTeacherForm";
import { useTeacherPasswordForm } from "../../hooks/useTeacherPasswordForm";

function inputClass(editing: boolean) {
  return editing
    ? "w-full px-4 py-2.5 bg-white border-2 border-[#003366] rounded-xl text-sm focus:outline-none transition-colors text-gray-800 shadow-sm"
    : "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#003366] focus:bg-white transition-colors text-gray-800 disabled:opacity-75 disabled:cursor-not-allowed";
}

interface Props {
  id: string;
  teacher: TeacherDetailsDto;
  redils: RedilDto[];
}

export default function TeacherDetails({ id, teacher, redils }: Props) {
  const { editing, setEditing, form, errors, loading, handleChange, handleCancel, handleSubmit } =
    useTeacherForm(id, teacher);

  const {
    editing: pwEditing,
    setEditing: setPwEditing,
    form: pwForm,
    errors: pwErrors,
    loading: pwLoading,
    handleChange: pwHandleChange,
    handleCancel: pwHandleCancel,
    handleSubmit: pwHandleSubmit,
  } = useTeacherPasswordForm(id);

  return (
    <section className="space-y-6">
      <header className="mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-[#003366]">Detalles del profesor</h1>
        <p className="text-sm text-gray-500 mt-1">Administra sus datos y estado de actividad.</p>
      </header>

      <div className={`bg-white rounded-2xl p-6 shadow-sm border space-y-5 ${editing ? "border-[#003366] ring-2 ring-blue-100/50" : "border-gray-100"}`}>
        {editing && (
          <div className="flex items-center gap-2 text-sm font-semibold text-[#003366] bg-blue-50/50 px-3 py-2 rounded-lg">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            Modo edición — los cambios se guardan al presionar "Guardar cambios"
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Nombre</label>
            <input
              className={inputClass(editing)}
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={!editing}
            />
            {errors.name && <p className="text-xs font-medium text-red-600 mt-1">{errors.name}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Email</label>
            <input
              className={inputClass(editing)}
              name="email"
              value={form.email}
              onChange={handleChange}
              disabled={!editing}
            />
            {errors.email && <p className="text-xs font-medium text-red-600 mt-1">{errors.email}</p>}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 items-end">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Redil</label>
            <select
              className={`w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none transition-colors h-[46px] appearance-none ${editing ? "bg-white border-2 border-[#003366] text-gray-800 shadow-sm" : "bg-gray-50 border border-gray-200 text-gray-800 disabled:opacity-75 disabled:cursor-not-allowed"}`}
              name="redilId"
              value={form.redilId ?? ""}
              onChange={handleChange}
              disabled={!editing}
            >
              <option value="">Sin redil asignado</option>
              {redils.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>

          <label className={`inline-flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium cursor-pointer select-none h-[46px] transition-colors ${editing ? "bg-white border-2 border-[#003366] text-gray-700 shadow-sm" : "bg-gray-50 border border-gray-200 text-gray-700 opacity-75 cursor-not-allowed"}`}>
            <input
              className="w-4 h-4 rounded border-gray-300 text-[#003366] focus:ring-[#003366] disabled:opacity-50"
              name="active"
              type="checkbox"
              checked={form.active}
              onChange={handleChange}
              disabled={!editing}
            />
            Docente activo en el sistema
          </label>
        </div>

        {errors.general && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
            <p className="text-xs font-medium text-red-600 text-center">{errors.general}</p>
          </div>
        )}

        <div className="pt-4 border-t border-gray-50 flex flex-wrap gap-3">
          {!editing ? (
            <button
              className="bg-[#003366] hover:bg-[#002244] text-white font-medium py-2 px-5 rounded-xl text-sm shadow-sm transition-colors"
              onClick={() => setEditing(true)}
            >
              Editar datos
            </button>
          ) : (
            <>
              <button
                className="bg-[#003366] hover:bg-[#002244] text-white font-medium py-2 px-5 rounded-xl text-sm shadow-sm transition-colors disabled:opacity-50"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Guardando..." : "Guardar cambios"}
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

      <div className={`bg-white rounded-2xl p-6 shadow-sm border space-y-5 ${pwEditing ? "border-[#003366] ring-2 ring-blue-100/50" : "border-gray-100"}`}>
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5 text-[#003366]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          <h2 className="font-bold text-lg text-[#003366]">Cambiar contraseña</h2>
        </div>

        {pwEditing && (
          <div className="flex items-center gap-2 text-sm font-semibold text-[#003366] bg-blue-50/50 px-3 py-2 rounded-lg">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            Modo edición
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Nueva contraseña</label>
          <input
            className={pwEditing ? "w-full px-4 py-2.5 bg-white border-2 border-[#003366] rounded-xl text-sm focus:outline-none transition-colors text-gray-800 shadow-sm" : "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#003366] focus:bg-white transition-colors text-gray-800 disabled:opacity-75 disabled:cursor-not-allowed"}
            name="newPassword"
            type="password"
            value={pwForm.newPassword}
            onChange={pwHandleChange}
            disabled={!pwEditing}
            placeholder="Mínimo 8 caracteres"
          />
          {pwErrors.newPassword && <p className="text-xs font-medium text-red-600 mt-1">{pwErrors.newPassword}</p>}
        </div>

        {pwErrors.general && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
            <p className="text-xs font-medium text-red-600 text-center">{pwErrors.general}</p>
          </div>
        )}

        <div className="pt-2 flex flex-wrap gap-3">
          {!pwEditing ? (
            <button
              className="bg-white border border-gray-200 hover:bg-gray-50 text-[#003366] font-medium py-2 px-5 rounded-xl text-sm transition-colors flex items-center gap-2"
              onClick={() => setPwEditing(true)}
            >
              Cambiar contraseña
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
            </button>
          ) : (
            <>
              <button
                className="bg-[#003366] hover:bg-[#002244] text-white font-medium py-2 px-6 rounded-xl text-sm shadow-sm transition-colors disabled:opacity-50"
                onClick={pwHandleSubmit}
                disabled={pwLoading}
              >
                {pwLoading ? "Actualizando..." : "Actualizar contraseña"}
              </button>
              <button
                className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 font-medium py-2 px-5 rounded-xl text-sm transition-colors"
                onClick={pwHandleCancel}
              >
                Cancelar
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
