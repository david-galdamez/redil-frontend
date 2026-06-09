import { useRegisterTeacherForm } from "../../hooks/useRegisterTeacherForm";

interface Props {
  rediles: RedilListDto[];
}

export default function RegisterTeacherForm({ rediles }: Props) {
  const { form, loading, errors, handleChange, handleSubmit } = useRegisterTeacherForm();

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700" htmlFor="name">Nombre</label>
          <input
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#003366] focus:bg-white transition-colors text-gray-800"
            type="text"
            id="name"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
          />
          {errors.name && <p className="text-xs font-medium text-red-600 mt-1">{errors.name}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700" htmlFor="email">Correo electrónico</label>
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
      </div>

      <div className="grid gap-5 md:grid-cols-2">
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

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700" htmlFor="redilId">Redil</label>
          <select
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#003366] focus:bg-white transition-colors text-gray-800 h-[46px]"
            name="redilId"
            id="redilId"
            required
            value={form.redilId}
            onChange={handleChange}
          >
            <option value="0">Seleccione un redil</option>
            {rediles.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
          {errors.redilId && <p className="text-xs font-medium text-red-600 mt-1">{errors.redilId}</p>}
        </div>
      </div>

      {errors.general && (
        <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
          <p className="text-xs font-medium text-red-600 text-center">{errors.general}</p>
        </div>
      )}

      <div className="pt-2">
        <button
          className="w-full sm:w-fit bg-[#003366] hover:bg-[#002244] text-white font-medium py-2.5 px-6 rounded-xl text-sm shadow-sm transition-colors disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? "Registrando..." : "Registrar"}
        </button>
      </div>
    </form>
  );
}
