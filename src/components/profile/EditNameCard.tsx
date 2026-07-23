import { useNameForm } from "../../hooks/useNameForm";
import type { UserDetailsDto } from "../../types/user";

interface Props {
  user: UserDetailsDto;
}

export default function EditNameCard({ user }: Props) {
  const { editing, setEditing, form, errors, loading, handleChange, handleCancel, handleSubmit } =
    useNameForm(user);

  return (
    <div className={`bg-white rounded-2xl shadow-sm border p-6 space-y-5 ${editing ? "border-[#003366] ring-2 ring-blue-100/50" : "border-gray-100"}`}>
      <div className="flex items-center gap-2 mb-2">
        <i className="ti ti-user-edit text-xl text-[#003366]"></i>
        <h2 className="font-bold text-lg text-[#003366]">Cambiar nombre</h2>
      </div>

      {editing && (
        <div className="flex items-center gap-2 text-sm font-semibold text-[#003366] bg-blue-50/50 px-3 py-2 rounded-lg">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
          Modo edición
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-700">Nombre completo</label>
        <input
          className={editing
            ? "w-full px-4 py-2.5 bg-white border-2 border-[#003366] rounded-xl text-sm focus:outline-none transition-colors text-gray-800 shadow-sm"
            : "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#003366] focus:bg-white transition-colors text-gray-800 disabled:opacity-75 disabled:cursor-not-allowed"}
          name="name"
          value={form.name}
          onChange={handleChange}
          disabled={!editing}
          placeholder="Tu nombre completo"
        />
        {errors.name && <p className="text-xs font-medium text-red-600 mt-1">{errors.name}</p>}
        {errors.general && <p className="text-xs font-medium text-red-600 mt-1">{errors.general}</p>}
      </div>

      <div className="pt-2 flex flex-wrap gap-3">
        {!editing ? (
          <button
            className="bg-white border border-gray-200 hover:bg-gray-50 text-[#003366] font-medium py-2 px-5 rounded-xl text-sm transition-colors"
            onClick={() => setEditing(true)}
          >
            Habilitar edición
          </button>
        ) : (
          <>
            <button
              className="bg-[#003366] hover:bg-[#002244] text-white font-medium py-2 px-6 rounded-xl text-sm shadow-sm transition-colors disabled:opacity-50"
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
  );
}
