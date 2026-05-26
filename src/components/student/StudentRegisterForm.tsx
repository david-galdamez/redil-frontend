import { useRedilRegisterForm } from "../../hooks/useRedilRegisterForm";

interface Props {
  redilCode: string;
  apiUrl: string;
  groups: GroupDto[];
}

export default function RedilRegisterForm({ redilCode, apiUrl, groups }: Props) {
  const { form, loading, errors, handleChange, handleSubmit } = useRedilRegisterForm(apiUrl, redilCode);

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700" htmlFor="name">Nombre completo</label>
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

      <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700" htmlFor="groupId">Grupo al que asiste</label>
          <select
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#003366] focus:bg-white transition-colors text-gray-800 appearance-none"
            id="groupId"
            name="groupId"
            required
            value={form.groupId}
            onChange={handleChange}
          >
            <option value="">Selecciona un grupo</option>
            {groups?.map(g => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
          {errors.groupId && <p className="text-xs font-medium text-red-600 mt-1">{errors.groupId}</p>}
        </div>

        <label
          className="inline-flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors select-none h-[46px]"
          htmlFor="isServer"
        >
          <input
            className="w-4 h-4 rounded border-gray-300 text-[#003366] focus:ring-[#003366]"
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