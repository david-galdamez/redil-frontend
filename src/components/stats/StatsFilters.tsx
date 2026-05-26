interface Props {
    filters: ClassStatsRequestDto;
    groups: GroupDto[];
    rediles: RedilListDto[];
    isAdmin: boolean;
    onChange: (partial: Partial<ClassStatsRequestDto>) => void;
}

export default function StatsFilters({ filters, groups, rediles, isAdmin, onChange }: Props) {
    const inputClasses = "w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#003366] focus:ring-1 focus:ring-[#003366] transition-all text-gray-800 appearance-none";
    const labelClasses = "text-xs font-semibold text-gray-600 mb-1 block";

    return (
        <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4 lg:p-5 shadow-sm space-y-3">
            <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[140px]">
                    <label className={labelClasses}>Desde</label>
                    <input
                        type="date"
                        className={inputClasses}
                        value={filters.fromDate}
                        onChange={e => onChange({ fromDate: e.target.value })}
                    />
                </div>

                <div className="flex-1 min-w-[140px]">
                    <label className={labelClasses}>Hasta</label>
                    <input
                        type="date"
                        className={inputClasses}
                        value={filters.toDate}
                        onChange={e => onChange({ toDate: e.target.value })}
                    />
                </div>

                {isAdmin && (
                    <div className="flex-1 min-w-[140px]">
                        <label className={labelClasses}>Redil</label>
                        <select
                            className={inputClasses}
                            value={filters.redilId ?? ""}
                            onChange={e => onChange({ redilId: e.target.value || undefined })}
                        >
                            <option value="">Todos los rediles</option>
                            {rediles.map(r => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                        </select>
                    </div>
                )}

                {groups.length > 0 && (
                    <div className="flex-1 min-w-[140px]">
                        <label className={labelClasses}>Grupo</label>
                        <select
                            className={inputClasses}
                            value={filters.groupId ?? ""}
                            onChange={e => onChange({ groupId: e.target.value ? Number(e.target.value) : undefined })}
                        >
                            <option value="">Todos los grupos</option>
                            {groups.map(g => (
                                <option key={g.id} value={g.id}>{g.name}</option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="flex-1 min-w-[140px] lg:min-w-[200px]">
                    <label className={labelClasses}>Buscar estudiante</label>
                    <input
                        type="search"
                        className={inputClasses}
                        placeholder="Nombre del estudiante..."
                        value={filters.search ?? ""}
                        onChange={e => onChange({ search: e.target.value || undefined })}
                    />
                </div>
            </div>
        </div>
    );
}