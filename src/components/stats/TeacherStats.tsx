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
    isAdmin,
    filters,
    groups,
    rediles,
    stats,
    page,
    totalPages,
    loading,
    error,
    fetchStats,
    handleFilterChange,
  } = useTeacherStats(redilId);

  const [exporting, setExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<"excel" | "pdf">("excel");

  async function handleExport() {
    setExporting(true);
    try {
      const token = localStorage.getItem("auth_token");

      const isPdf = exportFormat === "pdf";
      const endpoint = isAdmin
        ? `${API_URL}/api/redil/stats/export${isPdf ? "/pdf" : ""}`
        : `${API_URL}/api/teacher/redil/stats/export${isPdf ? "/pdf" : ""}`;

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
      a.download = `estadisticas_${filters.fromDate}_${filters.toDate}.${isPdf ? "pdf" : "xlsx"}`;
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
    <div className="w-full space-y-4">
      <StatsFilters
        filters={filters}
        groups={groups}
        rediles={rediles}
        isAdmin={isAdmin}
        onChange={handleFilterChange}
        onExport={handleExport}
        exporting={exporting}
        exportFormat={exportFormat}
        onExportFormatChange={setExportFormat}
      />

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-center text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-8">
          <p className="text-sm font-medium text-gray-500">Cargando estadísticas...</p>
        </div>
      )}

      {!loading && stats.length === 0 && !error && (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 py-8 text-center">
          <p className="text-sm text-gray-500">No hay estadísticas para el período seleccionado.</p>
        </div>
      )}

      {!loading && stats.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <StatsTable
            stats={stats}
            page={page}
            totalPages={totalPages}
            loading={loading}
            onPageChange={(p) => fetchStats(p, filters)}
          />
        </div>
      )}
    </div>
  );
}
