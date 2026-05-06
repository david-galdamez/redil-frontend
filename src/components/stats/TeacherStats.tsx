import { useTeacherStats } from "../../hooks/useTeacherStats";
import StatsFilters from "./StatsFilters";
import StatsTable from "./StatsTable";

interface Props {
    apiUrl: string;
    redilId?: string;
}

export default function TeacherStats({ apiUrl, redilId }: Props) {
    const {
        isAdmin, filters, groups, rediles,
        stats, page, totalPages, loading, error,
        fetchStats, handleFilterChange,
    } = useTeacherStats(apiUrl, redilId);

    return (
        <div className="space-y-4">
            <StatsFilters
                filters={filters}
                groups={groups}
                rediles={rediles}
                isAdmin={isAdmin}
                onChange={handleFilterChange}
            />

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
                <StatsTable
                    stats={stats}
                    page={page}
                    totalPages={totalPages}
                    loading={loading}
                    filters={filters}
                    onPageChange={p => fetchStats(p, filters)}
                />
            )}
        </div>
    );
}