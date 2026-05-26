import { usePaginatedFetch } from "../../hooks/usePaginatedFetch";
import Pagination from "../Pagination";

interface Props {
    initialTeachers: PaginatedResponse<TeacherDto[]>;
    initialSearch: string;
    apiUrl: string;
}

export default function TeacherDashboard({ initialTeachers, initialSearch, apiUrl }: Props) {
    const { data, loading, setPage, search, setSearch } = usePaginatedFetch({
        initialData: initialTeachers,
        endpoint: "/api/teacher",
        apiUrl,
        basePath: "/teacher",
        initialSearch,
        credentials: "include",
    });

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

                <div className="w-full">
                    <input
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#003366] shadow-sm text-gray-800"
                        type="search"
                        placeholder="Buscar profesor..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 transition-opacity duration-200 ${loading ? "opacity-50" : ""}`}>
                    {data.data.length > 0 ? (
                        data.data.map(teacher => (
                            <article
                                key={teacher.id}
                                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 cursor-pointer flex flex-col justify-between gap-4 transition-all"
                                onClick={() => window.location.href = `/teacher/${teacher.id}`}
                            >
                                <div className="space-y-1">
                                    <h2 className="text-base font-bold text-gray-900 group-hover:text-[#003366]">{teacher.name}</h2>
                                </div>
                                <div className="pt-2 border-t border-gray-50 flex items-center justify-between">
                                    <span className="text-xs font-semibold text-gray-500">Redil asignado:</span>
                                    <span className="text-xs font-bold text-[#003366] bg-blue-50 px-2 py-1 rounded-lg border border-blue-100/50">{teacher.redilName}</span>
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