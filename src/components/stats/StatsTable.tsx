import { ServerBadge } from "../student/StudentsTab";

interface Props {
    stats: RedilClassStatDto[];
    page: number;
    totalPages: number;
    loading: boolean;
    onPageChange: (page: number) => void;
    filters: ClassStatsRequestDto;
}

function AttendanceBadge({ value }: { value: number }) {
    const color = value >= 80 ? "#16a34a" : value >= 50 ? "#d97706" : "#dc2626";
    return <span style={{ color, fontWeight: 500 }}>{value.toFixed(1)}%</span>;
}

export default function StatsTable({ stats, page, totalPages, loading, onPageChange, filters }: Props) {
    return (
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
                        <span><ServerBadge isServer={s.isServer} /></span>
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
                        onClick={() => onPageChange(page - 1)}
                    >
                        Anterior
                    </button>
                    <button
                        className="btn-secondary"
                        disabled={page >= totalPages || loading}
                        onClick={() => onPageChange(page + 1)}
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    );
}