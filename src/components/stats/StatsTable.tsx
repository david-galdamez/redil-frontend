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
    const bgColor = value >= 80 ? "bg-green-50" : value >= 50 ? "bg-amber-50" : "bg-red-50";
    return (
        <span className={`inline-block px-2 py-1 rounded-lg text-xs font-bold ${bgColor}`} style={{ color }}>
            {value.toFixed(1)}%
        </span>
    );
}

export default function StatsTable({ stats, page, totalPages, loading, onPageChange, filters }: Props) {
    return (
        <div className="space-y-3 p-1">
            <div className="overflow-x-auto">
                <div className="min-w-[600px]">
                    <div className="grid grid-cols-[2fr_1.2fr_1.2fr_1fr_90px] gap-3 px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-100">
                        <span>Estudiante</span>
                        <span>Grupo</span>
                        <span>Redil</span>
                        <span className="text-center">Servidor</span>
                        <span className="text-right">Asistencia</span>
                    </div>

                    <div className="divide-y divide-gray-100 bg-white">
                        {stats.map((s, i) => (
                            <div
                                key={i}
                                className="grid grid-cols-[2fr_1.2fr_1.2fr_1fr_90px] gap-3 px-4 py-3 text-sm items-center hover:bg-gray-50/50 transition-colors"
                            >
                                <span className="font-semibold text-gray-900 truncate">{s.name}</span>
                                <span className="text-gray-600 truncate">{s.groupName}</span>
                                <span className="text-gray-600 truncate">{s.redilName}</span>
                                <span className="text-center"><ServerBadge isServer={s.isServer} /></span>
                                <span className="text-right">
                                    <AttendanceBadge value={s.attendancePercentage} />
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center px-4 py-3 text-sm text-gray-500 border-t border-gray-100 bg-gray-50/30">
                <span className="font-medium">Página {page} de {totalPages}</span>
                <div className="flex gap-2">
                    <button
                        className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={page <= 1 || loading}
                        onClick={() => onPageChange(page - 1)}
                    >
                        Anterior
                    </button>
                    <button
                        className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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