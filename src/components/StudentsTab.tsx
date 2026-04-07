import { useEffect, useState } from "react";
import type { StudentListDto } from "../types/students";

interface Props {
    redilId: string;
    apiUrl: string;
}

export default function StudentsTab({ redilId, apiUrl }: Props) {
    const [students, setStudents] = useState<StudentListDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");

    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true);
            setError(null);
            try {
                const params = new URLSearchParams({ page: String(page) });
                if (search) params.set("search", search);

                const res = await fetch(`${apiUrl}/api/student/redil/${redilId}?${params}`, {
                    credentials: "include",
                });
                const resData = (await res.json()) as ApiResponse<PaginatedResponse<StudentListDto[]>>;

                if (!res.ok || resData.data === undefined) {
                    setError(resData.message || "Error cargando estudiantes");
                    return;
                }

                setStudents(resData.data?.data ?? []);
                setTotalPages(resData.data?.totalPages || 1);
            } catch {
                setError("Error de red al cargar estudiantes");
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [redilId, page, search]);

    function handleSearch() {
        setPage(1);
        setSearch(searchInput);
    }

    function handleClear() {
        setSearchInput("");
        setSearch("");
        setPage(1);
    }

    if (error) return <p className="error-text">{error}</p>;

    return (
        <div className="space-y-3">
            {/* Búsqueda */}
            <div className="flex gap-2">
                <input
                    className="input-base flex-1"
                    type="search"
                    placeholder="Buscar estudiante..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <button className="btn-primary" onClick={handleSearch} disabled={loading}>
                    Buscar
                </button>
                {search && (
                    <button className="btn-secondary" onClick={handleClear}>
                        Limpiar
                    </button>
                )}
            </div>

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
                            {students.map((s) => (
                                <tr key={s.id}>
                                    <td className="px-4 py-2">{s.name}</td>
                                    <td className="px-4 py-2">{s.groupName}</td>
                                    <td className="px-4 py-2">
                                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${s.isServer
                                            ? "bg-green-100 text-green-700"
                                            : "bg-slate-100 text-slate-600"
                                            }`}>
                                            {s.isServer ? "Sí" : "No"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Paginacion */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between pt-1">
                    <p className="text-xs text-slate-500">
                        Página {page} de {totalPages}
                    </p>
                    <nav className="pagination-nav">
                        <button
                            className="pagination-btn"
                            onClick={() => setPage((p) => p - 1)}
                            disabled={page === 1 || loading}
                        >
                            Anterior
                        </button>
                        <button
                            className="pagination-btn"
                            onClick={() => setPage((p) => p + 1)}
                            disabled={page === totalPages || loading}
                        >
                            Siguiente
                        </button>
                    </nav>
                </div>
            )}
        </div>
    );
}