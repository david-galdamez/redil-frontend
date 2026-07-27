import { useRegisterRedilForm } from "../../hooks/useRegisterRedilForm";

export default function RegisterRedilForm() {
  const { form, loading, errors, handleChange, handleSubmit } = useRegisterRedilForm();

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-700" htmlFor="name">
          Nombre del redil
        </label>
        <input
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 transition-colors focus:border-[#003366] focus:bg-white focus:outline-none"
          type="text"
          id="name"
          name="name"
          required
          value={form.name}
          onChange={handleChange}
        />
        {errors.name && <p className="mt-1 text-xs font-medium text-red-600">{errors.name}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-700" htmlFor="numCourse">
          Número de curso
        </label>
        <input
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 transition-colors focus:border-[#003366] focus:bg-white focus:outline-none"
          type="number"
          id="numCourse"
          name="numCourse"
          required
          min={1}
          value={form.numCourse || ""}
          onChange={handleChange}
        />
        {errors.numCourse && (
          <p className="mt-1 text-xs font-medium text-red-600">{errors.numCourse}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-700" htmlFor="description">
          Descripción
        </label>
        <textarea
          className="min-h-[112px] w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 transition-colors focus:border-[#003366] focus:bg-white focus:outline-none"
          id="description"
          name="description"
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
          type="submit"
          disabled={loading}
        >
          {loading ? "Registrando..." : "Registrar redil"}
        </button>
      </div>
    </form>
  );
}
