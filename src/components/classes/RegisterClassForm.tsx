import { useRegisterClassForm } from "../../hooks/useRegisterClassForm";

export default function RegisterClassForm() {
  const { form, loading, errors, handleChange, handleSubmit } = useRegisterClassForm();

  return (
    <form
      className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-700" htmlFor="date">
          Fecha de la clase
        </label>
        <input
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 transition-colors focus:border-[#003366] focus:bg-white focus:outline-none"
          type="datetime-local"
          name="date"
          id="date"
          required
          value={form.date}
          onChange={handleChange}
        />
        {errors.date && <p className="mt-1 text-xs font-medium text-red-600">{errors.date}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-700" htmlFor="description">
          Descripción de la clase
        </label>
        <textarea
          className="min-h-[112px] w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 transition-colors focus:border-[#003366] focus:bg-white focus:outline-none"
          name="description"
          id="description"
          required
          value={form.description}
          onChange={handleChange}
        />
        {errors.description && (
          <p className="mt-1 text-xs font-medium text-red-600">{errors.description}</p>
        )}
      </div>

      {errors.general && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-3">
          <p className="text-center text-xs font-medium text-red-600">{errors.general}</p>
        </div>
      )}

      <div className="pt-2">
        <button
          className="w-full rounded-xl bg-[#003366] px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#002244] disabled:opacity-50 sm:w-fit"
          disabled={loading}
          type="submit"
        >
          {loading ? "Registrando..." : "Registrar clase"}
        </button>
      </div>
    </form>
  );
}
