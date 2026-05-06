import { useStudentsTab } from "../../hooks/useStudentsTab";
import Pagination from "../Pagination";

interface Props {
    redilId: string;
    apiUrl: string;
}

export default function StudentsTab({ redilId, apiUrl }: Props) {
    const { students, loading, error, page, setPage, totalPages, search, setSearch } =
        useStudentsTab(redilId, apiUrl);

    if (error) return <p className="error-text">{error}</p>;

    return (
        <div className="space-y-3">
            <input
                className="input-base w-full"
                type="search"
                placeholder="Buscar estudiante..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />

            {loading ? (
                <p className="text-sm text-slate-500">Cargando estudiantes...</p>
            ) : students.length === 0 ? (
                <p className="text-sm text-slate-600">
                    {search
                        ? `No se encontraron estudiantes con "${search}"`
                        : "No hay estudiantes inscritos en esta redil."}
                </p>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="min-w-full divide-y divide-slate-200 text-sm">
                        <thead className="bg-slate-100">
                            <tr>
                                <th className="px-4 py-2 text-left font-medium text-slate-700">Nombre</th>
                                <th className="px-4 py-2 text-left font-medium text-slate-700">Grupo</th>
                                <th className="px-4 py-2 text-left font-medium text-slate-700">Servidor</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {students.map(s => (
                                <tr key={s.id}>
                                    <td className="px-4 py-2">{s.name}</td>
                                    <td className="px-4 py-2">{s.groupName}</td>
                                    <td className="px-4 py-2">
                                        <ServerBadge isServer={s.isServer} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex items-center justify-between pt-1">
                    <p className="text-xs text-slate-500">Página {page} de {totalPages}</p>
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
        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${isServer ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
            }`}>
            {isServer ? "Sí" : "No"}
        </span>
    );
}