import { ServerBadge } from "../student/StudentsTab";

interface Props {
  stats: RedilClassStatDto[];
  page: number;
  totalPages: number;
  loading: boolean;
  onPageChange: (page: number) => void;
}

function AttendanceBadge({ value }: { value: number }) {
  const color = value >= 80 ? "#16a34a" : value >= 50 ? "#d97706" : "#dc2626";
  const bgColor = value >= 80 ? "bg-green-50" : value >= 50 ? "bg-amber-50" : "bg-red-50";
  return (
    <span
      className={`inline-block rounded-lg px-2 py-1 text-xs font-bold ${bgColor}`}
      style={{ color }}
    >
      {value.toFixed(1)}%
    </span>
  );
}

export default function StatsTable({ stats, page, totalPages, loading, onPageChange }: Props) {
  return (
    <div className="space-y-3 p-1">
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="grid grid-cols-[2fr_1.2fr_1.2fr_1fr_90px] gap-3 border-b border-gray-100 bg-gray-50 px-4 py-3 text-xs font-bold tracking-wider text-gray-500 uppercase">
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
                className="grid grid-cols-[2fr_1.2fr_1.2fr_1fr_90px] items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-gray-50/50"
              >
                <span className="truncate font-semibold text-gray-900">{s.name}</span>
                <span className="truncate text-gray-600">{s.groupName}</span>
                <span className="flex flex-wrap gap-1">
                  {s.rediles.map((r, ri) => (
                    <span
                      key={ri}
                      className="inline-block rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium whitespace-nowrap text-blue-700"
                    >
                      {r}
                    </span>
                  ))}
                </span>
                <span className="text-center">
                  <ServerBadge isServer={s.isServer} />
                </span>
                <span className="text-right">
                  <AttendanceBadge value={s.attendancePercentage} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/30 px-4 py-3 text-sm text-gray-500">
        <span className="font-medium">
          Página {page} de {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={page <= 1 || loading}
            onClick={() => onPageChange(page - 1)}
          >
            Anterior
          </button>
          <button
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
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
