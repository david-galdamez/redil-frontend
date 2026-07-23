import { useState } from "react";
import { useTeacherStats } from "../../hooks/useTeacherStats";
import { API_URL } from "../../lib/api/client";
import StatsFilters from "./StatsFilters";
import StatsTable from "./StatsTable";

interface Props {
  redilId?: string;
}

export default function TeacherStats({ redilId }: Props) {
  const {
    isAdmin, filters, groups, rediles,
    stats, page, totalPages, loading, error,
    fetchStats, handleFilterChange,
  } = useTeacherStats(redilId);

  const [exporting, setExporting] = useState(false);

  async function handleExport() {
    setExporting(true);
    try {
      const token = localStorage.getItem("auth_token");
      const endpoint = isAdmin
        ? `${API_URL}/api/redil/stats/export`
        : `${API_URL}/api/teacher/redil/stats/export`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(filters),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message ?? "Error al exportar.");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `estadisticas_${filters.fromDate}_${filters.toDate}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="space-y-4 w-full">
      <StatsFilters
        filters={filters}
        groups={groups}
        rediles={rediles}
        isAdmin={isAdmin}
        onChange={handleFilterChange}
        onExport={handleExport}
        exporting={exporting}
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
