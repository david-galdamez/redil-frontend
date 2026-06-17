import { useLoginForm } from "../hooks/useLoginForm";

export default function LoginForm() {
  const { form, loading, errors, handleChange, handleSubmit } = useLoginForm();

  return (
    <form className="w-full space-y-5" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-700" htmlFor="email">Correo</label>
        <input
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#003366] focus:bg-white transition-colors text-gray-800"
          type="email"
          id="email"
          name="email"
          required
          value={form.email}
          onChange={handleChange}
        />
        {errors.email && <p className="text-xs font-medium text-red-600 mt-1">{errors.email}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-700" htmlFor="password">Contraseña</label>
        <input
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#003366] focus:bg-white transition-colors text-gray-800"
          type="password"
          id="password"
          name="password"
          required
          value={form.password}
          onChange={handleChange}
        />
        {errors.password && <p className="text-xs font-medium text-red-600 mt-1">{errors.password}</p>}
      </div>

      {errors.general && (
        <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
          <p className="text-xs font-medium text-red-600 text-center">{errors.general}</p>
        </div>
      )}

      <button
        className="w-full bg-[#003366] hover:bg-[#002244] text-white font-medium py-2.5 px-4 rounded-xl text-sm shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        type="submit"
        disabled={loading}
      >
        {loading ? "Iniciando sesión..." : "Iniciar sesión"}
      </button>
    </form>
  );
}
