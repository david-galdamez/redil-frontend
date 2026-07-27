import { useStudentsTab } from "../../hooks/useStudentsTab";
import { useManualAttendance } from "../../hooks/useManualAttendance";
import Pagination from "../Pagination";

interface Props {
  redilId: string;
  attendanceToken: string;
}

export default function ManualAttendanceTab({ redilId, attendanceToken }: Props) {
  const { students, loading, error, page, setPage, totalPages, search, setSearch } =
    useStudentsTab(redilId);
  const { register, rowState } = useManualAttendance(attendanceToken);

  return (
    <div className="space-y-4">
      <div>
        <input
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 transition-colors focus:border-[#003366] focus:bg-white focus:outline-none"
          type="search"
          placeholder="Buscar estudiante por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && (
        <p className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      {loading ? (
        <p className="py-6 text-center text-sm text-gray-500">Cargando estudiantes...</p>
      ) : students.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-200 bg-gray-50 py-6 text-center text-sm text-gray-500">
          {search
            ? `No se encontraron estudiantes con "${search}"`
            : "No hay estudiantes inscritos en este redil."}
        </p>
      ) : (
        <div className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          {students.map((s) => {
            const state = rowState(s.phone);
            const isLoading = state === "loading";

            return (
              <div
                key={s.id}
                className="flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-gray-50/50"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900">{s.name}</p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {s.phone}
                    <span className="mx-1.5 text-gray-300">·</span>
                    {s.groupName}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {state === "attended" && (
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-green-100 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                      Asistió
                    </span>
                  )}
                  {state === "absent" && (
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 6 6 18M6 6l12 12" />
                      </svg>
                      No asistió
                    </span>
                  )}
                  {state === "error" && (
                    <span className="text-xs font-medium text-red-600">Error</span>
                  )}
                  {(state === "idle" || state === "error") && (
                    <>
                      <button
                        onClick={() => register(s.phone, true)}
                        disabled={isLoading}
                        className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                      >
                        Asistió
                      </button>
                      <button
                        onClick={() => register(s.phone, false)}
                        disabled={isLoading}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
                      >
                        No asistió
                      </button>
                    </>
                  )}
                  {state === "loading" && (
                    <svg
                      className="h-4 w-4 animate-spin text-[#003366]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                  )}
                  {(state === "attended" || state === "absent") && (
                    <button
                      onClick={() => register(s.phone, state === "absent")}
                      className="text-xs text-gray-400 underline underline-offset-2 transition-colors hover:text-gray-600"
                    >
                      Corregir
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-2 sm:flex-row">
          <p className="text-xs font-medium text-gray-500">
            Página {page} de {totalPages}
          </p>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
