import { useStudentsTab } from "../../hooks/useStudentsTab";
import Pagination from "../Pagination";

interface Props {
  redilId: string;
}

export default function StudentsTab({ redilId }: Props) {
  const { students, loading, error, page, setPage, totalPages, search, setSearch } =
    useStudentsTab(redilId);

  if (error)
    return (
      <p className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">
        {error}
      </p>
    );

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 transition-colors focus:border-[#003366] focus:bg-white focus:outline-none"
          type="search"
          placeholder="Buscar estudiante..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="py-4 text-center text-sm text-gray-500">Cargando estudiantes...</p>
      ) : students.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-200 bg-gray-50 py-6 text-center text-sm text-gray-500">
          {search
            ? `No se encontraron estudiantes con "${search}"`
            : "No hay estudiantes inscritos en esta redil."}
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-gray-100 bg-gray-50 font-semibold text-gray-700">
                <tr>
                  <th className="px-6 py-3.5">Nombre</th>
                  <th className="px-6 py-3.5">Grupo</th>
                  <th className="px-6 py-3.5">Teléfono</th>
                  <th className="px-6 py-3.5 text-center">Servidor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-600">
                {students.map((s) => (
                  <tr key={s.id} className="transition-colors hover:bg-gray-50/70">
                    <td className="px-6 py-3.5 font-medium text-gray-900">{s.name}</td>
                    <td className="px-6 py-3.5">{s.groupName}</td>
                    <td className="px-6 py-3.5">{s.phone}</td>
                    <td className="px-6 py-3.5 text-center">
                      <ServerBadge isServer={s.isServer} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

export function ServerBadge({ isServer }: { isServer: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        isServer
          ? "border border-green-100 bg-green-50 text-green-700"
          : "border border-gray-100 bg-gray-50 text-gray-600"
      }`}
    >
      {isServer ? "Sí" : "No"}
    </span>
  );
}
