import { useLoginForm } from "../hooks/useLoginForm";

export default function LoginForm() {
  const { form, loading, errors, handleChange, handleSubmit } = useLoginForm();

  return (
    <form className="w-full space-y-5" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-700" htmlFor="email">
          Correo
        </label>
        <input
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 transition-colors focus:border-[#003366] focus:bg-white focus:outline-none"
          type="email"
          id="email"
          name="email"
          required
          value={form.email}
          onChange={handleChange}
        />
        {errors.email && <p className="mt-1 text-xs font-medium text-red-600">{errors.email}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-700" htmlFor="password">
          Contraseña
        </label>
        <input
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 transition-colors focus:border-[#003366] focus:bg-white focus:outline-none"
          type="password"
          id="password"
          name="password"
          required
          value={form.password}
          onChange={handleChange}
        />
        {errors.password && (
          <p className="mt-1 text-xs font-medium text-red-600">{errors.password}</p>
        )}
      </div>

      {errors.general && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-3">
          <p className="text-center text-xs font-medium text-red-600">{errors.general}</p>
        </div>
      )}

      <button
        className="w-full rounded-xl bg-[#003366] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#002244] disabled:cursor-not-allowed disabled:opacity-50"
        type="submit"
        disabled={loading}
      >
        {loading ? "Iniciando sesión..." : "Iniciar sesión"}
      </button>
    </form>
  );
}
