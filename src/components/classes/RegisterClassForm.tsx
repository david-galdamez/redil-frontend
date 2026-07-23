import { useRegisterClassForm } from "../../hooks/useRegisterClassForm";

export default function RegisterClassForm() {
  const { form, loading, errors, handleChange, handleSubmit } = useRegisterClassForm();

  return (
    <form className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-700" htmlFor="date">Fecha de la clase</label>
        <input
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#003366] focus:bg-white transition-colors text-gray-800"
          type="datetime-local"
          name="date"
          id="date"
          required
          value={form.date}
          onChange={handleChange}
        />
        {errors.date && <p className="text-xs font-medium text-red-600 mt-1">{errors.date}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-700" htmlFor="description">Descripción de la clase</label>
        <textarea
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#003366] focus:bg-white transition-colors text-gray-800 min-h-[112px] resize-y"
          name="description"
          id="description"
          required
          value={form.description}
          onChange={handleChange}
        />
        {errors.description && <p className="text-xs font-medium text-red-600 mt-1">{errors.description}</p>}
      </div>

      {errors.general && (
        <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
          <p className="text-xs font-medium text-red-600 text-center">{errors.general}</p>
        </div>
      )}

      <div className="pt-2">
        <button
          className="w-full sm:w-fit bg-[#003366] hover:bg-[#002244] text-white font-medium py-2.5 px-6 rounded-xl text-sm shadow-sm transition-colors disabled:opacity-50"
          disabled={loading}
          type="submit"
        >
          {loading ? "Registrando..." : "Registrar clase"}
        </button>
      </div>
    </form>
  );
}
