interface Props {
    filters: ClassStatsRequestDto;
    groups: GroupDto[];
    rediles: RedilListDto[];
    isAdmin: boolean;
    onChange: (partial: Partial<ClassStatsRequestDto>) => void;
}

export default function StatsFilters({ filters, groups, rediles, isAdmin, onChange }: Props) {
    return (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
            <div className="flex flex-wrap gap-3">
                <div className="field-group flex-1 min-w-[140px]">
                    <label className="label-base">Desde</label>
                    <input
                        type="date"
                        className="input-base"
                        value={filters.fromDate}
                        onChange={e => onChange({ fromDate: e.target.value })}
                    />
                </div>

                <div className="field-group flex-1 min-w-[140px]">
                    <label className="label-base">Hasta</label>
                    <input
                        type="date"
                        className="input-base"
                        value={filters.toDate}
                        onChange={e => onChange({ toDate: e.target.value })}
                    />
                </div>

                {isAdmin && (
                    <div className="field-group flex-1 min-w-[140px]">
                        <label className="label-base">Redil</label>
                        <select
                            className="input-base"
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
                    <div className="field-group flex-1 min-w-[140px]">
                        <label className="label-base">Grupo</label>
                        <select
                            className="input-base"
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

                <div className="field-group flex-1 min-w-[140px]">
                    <label className="label-base">Buscar estudiante</label>
                    <input
                        type="search"
                        className="input-base"
                        placeholder="Nombre del estudiante..."
                        value={filters.search ?? ""}
                        onChange={e => onChange({ search: e.target.value || undefined })}
                    />
                </div>
            </div>
        </div>
    );
}