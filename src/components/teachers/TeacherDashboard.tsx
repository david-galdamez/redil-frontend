import { useState, useEffect } from "react";
import { usePaginatedFetch } from "../../hooks/usePaginatedFetch";
import { apiClient } from "../../lib/api/client";
import Pagination from "../Pagination";

interface Props {
  initialTeachers: PaginatedResponse<TeacherDto[]>;
  initialSearch: string;
  initialRedilId?: string;
  initialRoleId?: string;
}

export default function TeacherDashboard({ initialTeachers, initialSearch, initialRedilId, initialRoleId }: Props) {
  const [redilId, setRedilId] = useState(initialRedilId ?? "");
  const [roleId, setRoleId] = useState(initialRoleId ?? "");
  const [redils, setRedils] = useState<RedilDto[]>([]);

  const filters: Record<string, string> = {};
  if (redilId) filters.redilId = redilId;
  if (roleId) filters.roleId = roleId;

  const { data, loading, setPage, search, setSearch } = usePaginatedFetch({
    initialData: initialTeachers,
    endpoint: "api/teacher",
    basePath: "/teacher",
    initialSearch,
    filters,
  });

  useEffect(() => {
    apiClient.get<RedilDto[]>("api/redil").then(res => {
      if (res.data) setRedils(res.data);
    });
  }, []);

  return (
    <section className="min-h-screen bg-[#F4F6F9] p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#003366]">Dashboard de profesores</h1>
            <p className="text-sm text-gray-500 mt-1">Gestiona docentes y revisa su redil asignada.</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl px-4 py-2 shadow-sm text-xs text-gray-500 font-medium self-start md:self-auto">
            Página {data.currentPage} de {data.totalPages} — {data.totalRecords} profesores
          </div>
        </header>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#003366] shadow-sm text-gray-800"
            type="search"
            placeholder="Buscar profesor..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#003366] shadow-sm text-gray-800 appearance-none min-w-[160px]"
            value={redilId}
            onChange={e => setRedilId(e.target.value)}
          >
            <option value="">Todos los rediles</option>
            {redils.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
          <select
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#003366] shadow-sm text-gray-800 appearance-none min-w-[140px]"
            value={roleId}
            onChange={e => setRoleId(e.target.value)}
          >
            <option value="">Todos los roles</option>
            <option value="2">Maestros</option>
            <option value="1">Administradores</option>
          </select>
        </div>

        <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 transition-opacity duration-200 ${loading ? "opacity-50" : ""}`}>
          {data.data.length > 0 ? (
            data.data.map(teacher => (
              <article
                key={teacher.id}
                className={`rounded-2xl p-5 border shadow-sm cursor-pointer flex flex-col justify-between gap-4 transition-all hover:shadow-md ${teacher.isActive
                  ? "bg-white border-gray-100 hover:border-gray-200"
                  : "bg-red-50 border-red-200 hover:border-red-300"
                  }`}
                onClick={() => window.location.href = `/teacher/${teacher.id}`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className={`text-base font-bold ${teacher.isActive ? "text-gray-900" : "text-red-900"}`}>{teacher.name}</h2>
                    {!teacher.isActive && (
                      <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                        Inactivo
                      </span>
                    )}
                  </div>
                </div>
                <div className={`pt-2 border-t flex items-center justify-between ${teacher.isActive ? "border-gray-50" : "border-red-100"}`}>
                  <span className="text-xs font-semibold text-gray-500">Redil asignado:</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg border ${teacher.isActive
                    ? "text-[#003366] bg-blue-50 border-blue-100/50"
                    : "text-red-700 bg-red-100 border-red-200"
                    }`}>{teacher.redilName}</span>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full py-8 text-center bg-white rounded-2xl border border-dashed border-gray-200 text-sm text-gray-500">
              {search
                ? `No se encontraron profesores con "${search}"`
                : "No hay profesores registrados"}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4">
          <Pagination
            currentPage={data.currentPage}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
          <a href="/teacher/register" className="w-full sm:w-fit text-center bg-[#003366] hover:bg-[#002244] text-white font-medium py-2.5 px-6 rounded-xl text-sm shadow-sm transition-colors">
            Registrar profesor
          </a>
        </div>
      </div>
    </section>
  );
}
