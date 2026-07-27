import { useNameForm } from "../../hooks/useNameForm";
import type { UserDetailsDto } from "../../types/user";

interface Props {
  user: UserDetailsDto;
}

export default function EditNameCard({ user }: Props) {
  const { editing, setEditing, form, errors, loading, handleChange, handleCancel, handleSubmit } =
    useNameForm(user);

  return (
    <div
      className={`space-y-5 rounded-2xl border bg-white p-6 shadow-sm ${editing ? "border-[#003366] ring-2 ring-blue-100/50" : "border-gray-100"}`}
    >
      <div className="mb-2 flex items-center gap-2">
        <i className="ti ti-user-edit text-xl text-[#003366]"></i>
        <h2 className="text-lg font-bold text-[#003366]">Cambiar nombre</h2>
      </div>

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
          Modo edición
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-700">Nombre completo</label>
        <input
          className={
            editing
              ? "w-full rounded-xl border-2 border-[#003366] bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-colors focus:outline-none"
              : "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 transition-colors focus:border-[#003366] focus:bg-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-75"
          }
          name="name"
          value={form.name}
          onChange={handleChange}
          disabled={!editing}
          placeholder="Tu nombre completo"
        />
        {errors.name && <p className="mt-1 text-xs font-medium text-red-600">{errors.name}</p>}
        {errors.general && (
          <p className="mt-1 text-xs font-medium text-red-600">{errors.general}</p>
        )}
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        {!editing ? (
          <button
            className="rounded-xl border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-[#003366] transition-colors hover:bg-gray-50"
            onClick={() => setEditing(true)}
          >
            Habilitar edición
          </button>
        ) : (
          <>
            <button
              className="rounded-xl bg-[#003366] px-6 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#002244] disabled:opacity-50"
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
  );
}
