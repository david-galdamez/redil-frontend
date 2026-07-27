import { useRedilRegisterForm } from "../../hooks/useRedilRegisterForm";
import SelectWrapper from "../ui/SelectWrapper";

interface Props {
  redilCode: string;
  groups: GroupDto[];
}

export default function RedilRegisterForm({ redilCode, groups }: Props) {
  const { form, loading, errors, handleChange, handleSubmit } = useRedilRegisterForm(redilCode);

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700" htmlFor="name">
            Nombre completo
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
          <label className="text-sm font-semibold text-gray-700" htmlFor="phone">
            Teléfono
          </label>
          <input
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 transition-colors focus:border-[#003366] focus:bg-white focus:outline-none"
            type="tel"
            id="phone"
            name="phone"
            required
            placeholder="Ej. 76543210"
            value={form.phone}
            onChange={handleChange}
          />
          {errors.phone && <p className="mt-1 text-xs font-medium text-red-600">{errors.phone}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-700" htmlFor="email">
          Correo electrónico <span className="font-normal text-gray-400">(opcional)</span>
        </label>
        <input
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 transition-colors focus:border-[#003366] focus:bg-white focus:outline-none"
          type="email"
          id="email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />
        {errors.email && <p className="mt-1 text-xs font-medium text-red-600">{errors.email}</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700" htmlFor="groupId">
            Grupo al que asiste
          </label>
          <SelectWrapper>
            <select
              className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 pr-8 text-sm text-gray-800 transition-colors focus:border-[#003366] focus:bg-white focus:outline-none"
              id="groupId"
              name="groupId"
              required
              value={form.groupId}
              onChange={handleChange}
            >
              <option value="">Selecciona un grupo</option>
              {groups?.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </SelectWrapper>
          {errors.groupId && (
            <p className="mt-1 text-xs font-medium text-red-600">{errors.groupId}</p>
          )}
        </div>

        <label
          className="inline-flex h-[46px] cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 transition-colors select-none hover:bg-gray-100"
          htmlFor="isServer"
        >
          <input
            className="h-4 w-4 rounded border-gray-300 text-[#003366] focus:ring-[#003366]"
            type="checkbox"
            id="isServer"
            name="isServer"
            checked={form.isServer}
            onChange={handleChange}
          />
          Es servidor
        </label>
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
