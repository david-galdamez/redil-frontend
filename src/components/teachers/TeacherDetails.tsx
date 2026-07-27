import { useTeacherForm } from "../../hooks/useTeacherForm";
import { useTeacherPasswordForm } from "../../hooks/useTeacherPasswordForm";
import SelectWrapper from "../ui/SelectWrapper";

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
        <h1 className="text-2xl font-bold text-[#003366] md:text-3xl">Detalles del profesor</h1>
        <p className="mt-1 text-sm text-gray-500">Administra sus datos y estado de actividad.</p>
      </header>

      <div
        className={`space-y-5 rounded-2xl border bg-white p-6 shadow-sm ${editing ? "border-[#003366] ring-2 ring-blue-100/50" : "border-gray-100"}`}
      >
        {editing && (
          <div className="flex items-center gap-2 rounded-lg bg-blue-50/50 px-3 py-2 text-sm font-semibold text-[#003366]">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            {'Modo edición — los cambios se guardan al presionar "Guardar cambios"'}
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
            {errors.name && <p className="mt-1 text-xs font-medium text-red-600">{errors.name}</p>}
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
            {errors.email && (
              <p className="mt-1 text-xs font-medium text-red-600">{errors.email}</p>
            )}
          </div>
        </div>

        <div className="grid items-end gap-5 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Redil</label>
            <SelectWrapper>
              <select
                className={`h-[46px] w-full appearance-none rounded-xl px-4 py-2.5 pr-8 text-sm transition-colors focus:outline-none ${editing ? "border-2 border-[#003366] bg-white text-gray-800 shadow-sm" : "border border-gray-200 bg-gray-50 text-gray-800 disabled:cursor-not-allowed disabled:opacity-75"}`}
                name="redilId"
                value={form.redilId ?? ""}
                onChange={handleChange}
                disabled={!editing}
              >
                <option value="">Sin redil asignado</option>
                {redils.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </SelectWrapper>
          </div>

          <label
            className={`inline-flex h-[46px] cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-colors select-none ${editing ? "border-2 border-[#003366] bg-white text-gray-700 shadow-sm" : "cursor-not-allowed border border-gray-200 bg-gray-50 text-gray-700 opacity-75"}`}
          >
            <input
              className="h-4 w-4 rounded border-gray-300 text-[#003366] focus:ring-[#003366] disabled:opacity-50"
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
          <div className="rounded-xl border border-red-100 bg-red-50 p-3">
            <p className="text-center text-xs font-medium text-red-600">{errors.general}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-3 border-t border-gray-50 pt-4">
          {!editing ? (
            <button
              className="rounded-xl bg-[#003366] px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#002244]"
              onClick={() => setEditing(true)}
            >
              Editar datos
            </button>
          ) : (
            <>
              <button
                className="rounded-xl bg-[#003366] px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#002244] disabled:opacity-50"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Guardando..." : "Guardar cambios"}
              </button>
              <button
                className="rounded-xl border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
                onClick={handleCancel}
              >
                Cancelar
              </button>
            </>
          )}
        </div>
      </div>

      <div
        className={`space-y-5 rounded-2xl border bg-white p-6 shadow-sm ${pwEditing ? "border-[#003366] ring-2 ring-blue-100/50" : "border-gray-100"}`}
      >
        <div className="mb-2 flex items-center gap-2">
          <svg
            className="h-5 w-5 text-[#003366]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <h2 className="text-lg font-bold text-[#003366]">Cambiar contraseña</h2>
        </div>

        {pwEditing && (
          <div className="flex items-center gap-2 rounded-lg bg-blue-50/50 px-3 py-2 text-sm font-semibold text-[#003366]">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            Modo edición
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Nueva contraseña</label>
          <input
            className={
              pwEditing
                ? "w-full rounded-xl border-2 border-[#003366] bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-colors focus:outline-none"
                : "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 transition-colors focus:border-[#003366] focus:bg-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-75"
            }
            name="newPassword"
            type="password"
            value={pwForm.newPassword}
            onChange={pwHandleChange}
            disabled={!pwEditing}
            placeholder="Mínimo 8 caracteres"
          />
          {pwErrors.newPassword && (
            <p className="mt-1 text-xs font-medium text-red-600">{pwErrors.newPassword}</p>
          )}
        </div>

        {pwErrors.general && (
          <div className="rounded-xl border border-red-100 bg-red-50 p-3">
            <p className="text-center text-xs font-medium text-red-600">{pwErrors.general}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-3 pt-2">
          {!pwEditing ? (
            <button
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-[#003366] transition-colors hover:bg-gray-50"
              onClick={() => setPwEditing(true)}
            >
              Cambiar contraseña
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          ) : (
            <>
              <button
                className="rounded-xl bg-[#003366] px-6 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#002244] disabled:opacity-50"
                onClick={pwHandleSubmit}
                disabled={pwLoading}
              >
                {pwLoading ? "Actualizando..." : "Actualizar contraseña"}
              </button>
              <button
                className="rounded-xl border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
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
