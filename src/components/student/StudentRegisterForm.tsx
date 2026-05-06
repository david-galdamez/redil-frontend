import { useRedilRegisterForm } from "../../hooks/useRedilRegisterForm";

interface Props {
  redilCode: string;
  apiUrl: string;
  groups: GroupDto[];
}

export default function RedilRegisterForm({ redilCode, apiUrl, groups }: Props) {
  const { form, loading, errors, handleChange, handleSubmit } = useRedilRegisterForm(apiUrl, redilCode);

  return (
    <form className="form-card form-card-compact form-grid" onSubmit={handleSubmit}>
      <div className="field-group">
        <label className="label-base" htmlFor="name">Nombre completo</label>
        <input
          className="input-base"
          type="text"
          id="name"
          name="name"
          required
          value={form.name}
          onChange={handleChange}
        />
        {errors.name && <p className="error-text">{errors.name}</p>}
      </div>

      <div className="field-group">
        <label className="label-base" htmlFor="email">Correo electrónico</label>
        <input
          className="input-base"
          type="email"
          id="email"
          name="email"
          required
          value={form.email}
          onChange={handleChange}
        />
        {errors.email && <p className="error-text">{errors.email}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="field-group">
          <label className="label-base" htmlFor="groupId">Grupo al que asiste</label>
          <select
            className="input-base"
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
          {errors.groupId && <p className="error-text">{errors.groupId}</p>}
        </div>

        <label
          className="inline-flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
          htmlFor="isServer"
        >
          <input
            className="checkbox-base"
            type="checkbox"
            id="isServer"
            name="isServer"
            checked={form.isServer}
            onChange={handleChange}
          />
          Es servidor
        </label>
      </div>

      {errors.general && <p className="error-text">{errors.general}</p>}

      <button className="btn-primary w-full sm:w-fit" type="submit" disabled={loading}>
        {loading ? "Inscribiéndose..." : "Inscribirse"}
      </button>
    </form>
  );
}