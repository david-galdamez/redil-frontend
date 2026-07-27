import { useState, useEffect } from "react";
import { usePaginatedFetch } from "../../hooks/usePaginatedFetch";
import { apiClient } from "../../lib/api/client";
import Pagination from "../Pagination";
import SelectWrapper from "../ui/SelectWrapper";

interface Props {
  initialTeachers: PaginatedResponse<TeacherDto[]>;
  initialSearch: string;
  initialRedilId?: string;
  initialRoleId?: string;
}

export default function TeacherDashboard({
  initialTeachers,
  initialSearch,
  initialRedilId,
  initialRoleId,
}: Props) {
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
    apiClient.get<RedilDto[]>("api/redil").then((res) => {
      if (res.data) setRedils(res.data);
    });
  }, []);

  return (
    <section className="min-h-screen bg-[#F4F6F9] p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#003366] md:text-3xl">
              Dashboard de profesores
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Gestiona docentes y revisa su redil asignada.
            </p>
          </div>
          <div className="self-start rounded-xl border border-gray-100 bg-white px-4 py-2 text-xs font-medium text-gray-500 shadow-sm md:self-auto">
            Página {data.currentPage} de {data.totalPages} — {data.totalRecords} profesores
          </div>
        </header>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm focus:border-[#003366] focus:outline-none"
            type="search"
            placeholder="Buscar profesor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <SelectWrapper>
            <select
              className="min-w-[160px] appearance-none rounded-xl border border-gray-200 bg-white px-4 py-2.5 pr-8 text-sm text-gray-800 shadow-sm focus:border-[#003366] focus:outline-none"
              value={redilId}
              onChange={(e) => setRedilId(e.target.value)}
            >
              <option value="">Todos los rediles</option>
              {redils.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </SelectWrapper>
          <SelectWrapper>
            <select
              className="min-w-[140px] appearance-none rounded-xl border border-gray-200 bg-white px-4 py-2.5 pr-8 text-sm text-gray-800 shadow-sm focus:border-[#003366] focus:outline-none"
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
            >
              <option value="">Todos los roles</option>
              <option value="2">Maestros</option>
              <option value="1">Administradores</option>
            </select>
          </SelectWrapper>
        </div>

        <div
          className={`grid gap-4 transition-opacity duration-200 sm:grid-cols-2 lg:grid-cols-3 ${loading ? "opacity-50" : ""}`}
        >
          {data.data.length > 0 ? (
            data.data.map((teacher) => (
              <article
                key={teacher.id}
                className={`flex cursor-pointer flex-col justify-between gap-4 rounded-2xl border p-5 shadow-sm transition-all hover:shadow-md ${
                  teacher.isActive
                    ? "border-gray-100 bg-white hover:border-gray-200"
                    : "border-red-200 bg-red-50 hover:border-red-300"
                }`}
                onClick={() => (window.location.href = `/teacher/${teacher.id}`)}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h2
                      className={`text-base font-bold ${teacher.isActive ? "text-gray-900" : "text-red-900"}`}
                    >
                      {teacher.name}
                    </h2>
                    {!teacher.isActive && (
                      <span className="shrink-0 rounded-full border border-red-200 bg-red-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-red-700 uppercase">
                        Inactivo
                      </span>
                    )}
                  </div>
                </div>
                <div
                  className={`flex items-center justify-between border-t pt-2 ${teacher.isActive ? "border-gray-50" : "border-red-100"}`}
                >
                  <span className="text-xs font-semibold text-gray-500">Redil asignado:</span>
                  <span
                    className={`rounded-lg border px-2 py-1 text-xs font-bold ${
                      teacher.isActive
                        ? "border-blue-100/50 bg-blue-50 text-[#003366]"
                        : "border-red-200 bg-red-100 text-red-700"
                    }`}
                  >
                    {teacher.redilName}
                  </span>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-dashed border-gray-200 bg-white py-8 text-center text-sm text-gray-500">
              {search
                ? `No se encontraron profesores con "${search}"`
                : "No hay profesores registrados"}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <Pagination
            currentPage={data.currentPage}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
          <a
            href="/teacher/register"
            className="w-full rounded-xl bg-[#003366] px-6 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#002244] sm:w-fit"
          >
            Registrar profesor
          </a>
        </div>
      </div>
    </section>
  );
}
