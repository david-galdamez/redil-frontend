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
        <div className="space-y-4 w-full">
            <StatsFilters
                filters={filters}
                groups={groups}
                rediles={rediles}
                isAdmin={isAdmin}
                onChange={handleFilterChange}
            />

            {error && (
                <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600 text-center">
                    {error}
                </div>
            )}

            {loading && (
                <div className="py-8 flex justify-center items-center">
                    <p className="text-sm font-medium text-gray-500">Cargando estadísticas...</p>
                </div>
            )}

            {!loading && stats.length === 0 && !error && (
                <div className="py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-sm text-gray-500">
                        No hay estadísticas para el período seleccionado.
                    </p>
                </div>
            )}

            {!loading && stats.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <StatsTable
                        stats={stats}
                        page={page}
                        totalPages={totalPages}
                        loading={loading}
                        filters={filters}
                        onPageChange={p => fetchStats(p, filters)}
                    />
                </div>
            )}
        </div>
    );
}