import { useEffect, useState, useRef } from "react";

interface Props {
    apiUrl: string;
    redilId?: string;
}

function AttendanceBadge({ value }: { value: number }) {
    const color =
        value >= 80 ? "#16a34a"
            : value >= 50 ? "#d97706"
                : "#dc2626";
    return (
        <span style={{ color, fontWeight: 500 }}>
            {value.toFixed(1)}%
        </span>
    );
}

export default function TeacherStats({ apiUrl, redilId }: Props) {
    const isAdmin = redilId === undefined;

    const today = new Date().toISOString().split("T")[0];
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

    const [filters, setFilters] = useState<ClassStatsRequestDto>({
        fromDate: thirtyDaysAgo,
        toDate: today,
        redilId: isAdmin ? undefined : redilId,
        groupId: undefined,
        search: undefined,
    });

    const [groups, setGroups] = useState<GroupDto[]>([]);
    const [rediles, setRediles] = useState<RedilListDto[]>([]);
    const [stats, setStats] = useState<RedilClassStatDto[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    useEffect(() => {
        fetchGroups();
        if (isAdmin) fetchRediles();
        fetchStats(1, filters);
    }, []);

    async function fetchGroups() {
        try {
            const res = await fetch(`${apiUrl}/api/groups`);
            const data: ApiResponse<GroupDto[]> = await res.json();
            if (data.success) setGroups(data.data ?? []);
        } catch { }
    }

    async function fetchRediles() {
        try {
            const res = await fetch(`${apiUrl}/api/redil`);
            const data: ApiResponse<RedilListDto[]> = await res.json();
            if (data.success) setRediles(data.data ?? []);
        } catch { }
    }

    async function fetchStats(targetPage: number, currentFilters: ClassStatsRequestDto) {
        setLoading(true);
        setError(null);
        try {
            const endpoint = isAdmin
                ? `${apiUrl}/api/redil/stats?page=${targetPage}`
                : `${apiUrl}/api/teacher/redil/stats?page=${targetPage}`;
            const res = await fetch(endpoint, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(currentFilters),
            });
            const data: ApiResponse<PaginatedResponse<RedilClassStatDto[]>> = await res.json();
            if (data.success && data.data) {
                setStats(data.data.data);
                setTotalPages(data.data.totalPages);
                setPage(data.data.currentPage);
            } else {
                setError(data.message ?? "Error al cargar estadísticas.");
            }
        } catch {
            setError("Error de conexión.");
        } finally {
            setLoading(false);
        }
    }

    function handleFilterChange(partial: Partial<ClassStatsRequestDto>) {
        setFilters((prev) => {
            const updated = { ...prev, ...partial };
            clearTimeout(debounceRef.current!);
            debounceRef.current = setTimeout(() => fetchStats(1, updated), 500);
            return updated;
        });
    }

    return (
        <div className="space-y-4">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
                <div className="flex flex-wrap gap-3">
                    <div className="field-group flex-1 min-w-[140px]">
                        <label className="label-base">Desde</label>
                        <input
                            type="date"
                            className="input-base"
                            value={filters.fromDate}
                            onChange={(e) => handleFilterChange({ fromDate: e.target.value })}
                        />
                    </div>
                    <div className="field-group flex-1 min-w-[140px]">
                        <label className="label-base">Hasta</label>
                        <input
                            type="date"
                            className="input-base"
                            value={filters.toDate}
                            onChange={(e) => handleFilterChange({ toDate: e.target.value })}
                        />
                    </div>
                    {isAdmin && (
                        <div className="field-group flex-1 min-w-[140px]">
                            <label className="label-base">Redil</label>
                            <select
                                className="input-base"
                                value={filters.redilId ?? ""}
                                onChange={(e) =>
                                    handleFilterChange({
                                        redilId: e.target.value || undefined,
                                    })
                                }
                            >
                                <option value="">Todos los rediles</option>
                                {rediles.map((r) => (
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
                                onChange={(e) =>
                                    handleFilterChange({
                                        groupId: e.target.value ? Number(e.target.value) : undefined,
                                    })
                                }
                            >
                                <option value="">Todos los grupos</option>
                                {groups.map((g) => (
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
                            onChange={(e) =>
                                handleFilterChange({
                                    search: e.target.value || undefined,
                                })
                            }
                        />
                    </div>
                </div>
            </div>

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {loading && (
                <p className="text-sm text-slate-500 text-center py-6">Cargando...</p>
            )}

            {!loading && stats.length === 0 && !error && (
                <p className="text-sm text-slate-500 text-center py-6">
                    No hay estadísticas para el período seleccionado.
                </p>
            )}

            {stats.length > 0 && (
                <div className="space-y-2">
                    <div className="grid grid-cols-[2fr_1.2fr_1.2fr_1fr_80px] gap-2 px-3 text-xs font-medium text-slate-500">
                        <span>Estudiante</span>
                        <span>Grupo</span>
                        <span>Redil</span>
                        <span>Servidor</span>
                        <span className="text-right">Asistencia</span>
                    </div>
                    <div className="rounded-lg border border-slate-200 overflow-hidden">
                        {stats.map((s, i) => (
                            <div
                                key={i}
                                className={`grid grid-cols-[2fr_1.2fr_1.2fr_1fr_80px] gap-2 px-3 py-2 text-sm ${i < stats.length - 1 ? "border-b border-slate-100" : ""
                                    }`}
                            >
                                <span className="font-medium truncate">{s.name}</span>
                                <span className="text-slate-500 truncate">{s.groupName}</span>
                                <span className="text-slate-500 truncate">{s.redilName}</span>
                                <span>
                                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${s.isServer ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                                        }`}>
                                        {s.isServer ? "Sí" : "No"}
                                    </span>
                                </span>
                                <span className="text-right">
                                    <AttendanceBadge value={s.attendancePercentage} />
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between items-center pt-1 text-sm text-slate-500">
                        <span>Página {page} de {totalPages}</span>
                        <div className="flex gap-2">
                            <button
                                className="btn-secondary"
                                disabled={page <= 1 || loading}
                                onClick={() => fetchStats(page - 1, filters)}
                            >
                                Anterior
                            </button>
                            <button
                                className="btn-secondary"
                                disabled={page >= totalPages || loading}
                                onClick={() => fetchStats(page + 1, filters)}
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}