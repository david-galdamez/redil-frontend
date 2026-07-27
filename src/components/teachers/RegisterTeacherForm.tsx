import { useRegisterTeacherForm } from "../../hooks/useRegisterTeacherForm";
import SelectWrapper from "../ui/SelectWrapper";

interface Props {
  rediles: RedilListDto[];
}

export default function RegisterTeacherForm({ rediles }: Props) {
  const { form, loading, errors, handleChange, handleSubmit } = useRegisterTeacherForm();

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700" htmlFor="name">
            Nombre
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
          <label className="text-sm font-semibold text-gray-700" htmlFor="email">
            Correo electrónico
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
      </div>

      <div className="grid gap-5 md:grid-cols-2">
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

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700" htmlFor="redilId">
            Redil
          </label>
          <SelectWrapper>
            <select
              className="h-[46px] w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 pr-8 text-sm text-gray-800 transition-colors focus:border-[#003366] focus:bg-white focus:outline-none"
              name="redilId"
              id="redilId"
              required
              value={form.redilId}
              onChange={handleChange}
            >
              <option value="0">Seleccione un redil</option>
              {rediles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </SelectWrapper>
          {errors.redilId && (
            <p className="mt-1 text-xs font-medium text-red-600">{errors.redilId}</p>
          )}
        </div>
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
          {loading ? "Registrando..." : "Registrar"}
        </button>
      </div>
    </form>
  );
}
