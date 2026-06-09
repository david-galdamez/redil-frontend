import { useNameForm } from "../../hooks/useNameForm";
import type { UserDetailsDto } from "../../types/user";

interface Props {
  user: UserDetailsDto;
}

export default function EditNameCard({ user }: Props) {
  const { editing, setEditing, form, errors, loading, handleChange, handleCancel, handleSubmit } =
    useNameForm(user);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
      <div className="flex items-center gap-2 mb-2">
        <i className="ti ti-user-edit text-xl text-[#003366]"></i>
        <h2 className="font-bold text-lg text-[#003366]">Cambiar nombre</h2>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-700">Nombre completo</label>
        <input
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#003366] focus:bg-white transition-colors text-gray-800 disabled:opacity-75 disabled:cursor-not-allowed"
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
