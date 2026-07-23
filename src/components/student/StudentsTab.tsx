import { useStudentsTab } from "../../hooks/useStudentsTab";
import Pagination from "../Pagination";

interface Props {
  redilId: string;
}

export default function StudentsTab({ redilId }: Props) {
  const { students, loading, error, page, setPage, totalPages, search, setSearch } =
    useStudentsTab(redilId);

  if (error) return <p className="text-sm font-medium text-red-600 p-4 bg-red-50 rounded-xl border border-red-100">{error}</p>;

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#003366] focus:bg-white transition-colors text-gray-800"
          type="search"
          placeholder="Buscar estudiante..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="text-sm text-gray-500 py-4 text-center">Cargando estudiantes...</p>
      ) : students.length === 0 ? (
        <p className="text-sm text-gray-500 py-6 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
          {search
            ? `No se encontraron estudiantes con "${search}"`
            : "No hay estudiantes inscritos en esta redil."}
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-700 font-semibold">
                <tr>
                  <th className="px-6 py-3.5">Nombre</th>
                  <th className="px-6 py-3.5">Grupo</th>
                  <th className="px-6 py-3.5 text-center">Servidor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-600">
                {students.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-6 py-3.5 font-medium text-gray-900">{s.name}</td>
                    <td className="px-6 py-3.5">{s.groupName}</td>
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500 font-medium">Página {page} de {totalPages}</p>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}

export function ServerBadge({ isServer }: { isServer: boolean }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${isServer
      ? "bg-green-50 text-green-700 border border-green-100"
      : "bg-gray-50 text-gray-600 border border-gray-100"
      }`}>
      {isServer ? "Sí" : "No"}
    </span>
  );
}
