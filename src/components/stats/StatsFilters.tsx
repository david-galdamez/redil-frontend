import SelectWrapper from "../ui/SelectWrapper";

type ExportFormat = "excel" | "pdf";

interface Props {
  filters: ClassStatsRequestDto;
  groups: GroupDto[];
  rediles: RedilListDto[];
  isAdmin: boolean;
  onChange: (partial: Partial<ClassStatsRequestDto>) => void;
  onExport?: () => void;
  exporting?: boolean;
  exportFormat?: ExportFormat;
  onExportFormatChange?: (format: ExportFormat) => void;
}

export default function StatsFilters({
  filters,
  groups,
  rediles,
  isAdmin,
  onChange,
  onExport,
  exporting,
  exportFormat = "excel",
  onExportFormatChange,
}: Props) {
  const inputClasses =
    "w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#003366] focus:ring-1 focus:ring-[#003366] transition-all text-gray-800 appearance-none";
  const selectClasses = `${inputClasses} pr-8`;
  const labelClasses = "text-xs font-semibold text-gray-600 mb-1 block";

  return (
    <div className="space-y-3 rounded-2xl border border-gray-100 bg-gray-50/50 p-4 shadow-sm lg:p-5">
      <div className="flex flex-wrap gap-4">
        <div className="min-w-[140px] flex-1">
          <label className={labelClasses}>Desde</label>
          <input
            type="date"
            className={inputClasses}
            value={filters.fromDate}
            onChange={(e) => onChange({ fromDate: e.target.value })}
          />
        </div>

        <div className="min-w-[140px] flex-1">
          <label className={labelClasses}>Hasta</label>
          <input
            type="date"
            className={inputClasses}
            value={filters.toDate}
            onChange={(e) => onChange({ toDate: e.target.value })}
          />
        </div>

        {isAdmin && (
          <div className="min-w-[140px] flex-1">
            <label className={labelClasses}>Redil</label>
            <SelectWrapper>
              <select
                className={selectClasses}
                value={filters.redilId ?? ""}
                onChange={(e) => onChange({ redilId: e.target.value || undefined })}
              >
                <option value="">Todos los rediles</option>
                {rediles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </SelectWrapper>
          </div>
        )}

        {groups.length > 0 && (
          <div className="min-w-[140px] flex-1">
            <label className={labelClasses}>Grupo</label>
            <SelectWrapper>
              <select
                className={selectClasses}
                value={filters.groupId ?? ""}
                onChange={(e) =>
                  onChange({ groupId: e.target.value ? Number(e.target.value) : undefined })
                }
              >
                <option value="">Todos los grupos</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </SelectWrapper>
          </div>
        )}

        <div className="min-w-[140px] flex-1 lg:min-w-[200px]">
          <label className={labelClasses}>Buscar estudiante</label>
          <input
            type="search"
            className={inputClasses}
            placeholder="Nombre del estudiante..."
            value={filters.search ?? ""}
            onChange={(e) => onChange({ search: e.target.value || undefined })}
          />
        </div>
      </div>

      {onExport && (
        <div className="flex items-end justify-end gap-2 pt-2">
          <div className="flex flex-col gap-1">
            <label className={labelClasses}>Formato</label>
            <SelectWrapper>
              <select
                className={selectClasses}
                value={exportFormat}
                onChange={(e) => onExportFormatChange?.(e.target.value as ExportFormat)}
                disabled={exporting}
              >
                <option value="excel">Excel</option>
                <option value="pdf">PDF</option>
              </select>
            </SelectWrapper>
          </div>
          <button
            onClick={onExport}
            disabled={exporting}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {exporting ? "Exportando..." : "Exportar"}
          </button>
        </div>
      )}
    </div>
  );
}
