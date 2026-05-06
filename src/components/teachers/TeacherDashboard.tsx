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
        <section className="page-shell">
            <header className="page-header">
                <h1 className="page-title">Dashboard de profesores</h1>
                <p className="page-subtitle">Gestiona docentes y revisa su redil asignada.</p>
                <p className="text-sm text-slate-500">
                    Página {data.currentPage} de {data.totalPages} —{" "}
                    {data.totalRecords} profesores ({data.pageSize} por página)
                </p>
            </header>

            <input
                className="input-base mb-4"
                type="search"
                placeholder="Buscar profesor..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />

            <div className={`card-grid card-grid-balanced transition-opacity ${loading ? "opacity-50" : ""}`}>
                {data.data.length > 0 ? (
                    data.data.map(teacher => (
                        <article
                            key={teacher.id}
                            className="item-card item-card-balanced cursor-pointer"
                            onClick={() => window.location.href = `/teacher/${teacher.id}`}
                        >
                            <h2 className="text-lg font-semibold text-slate-900">{teacher.name}</h2>
                            <p className="mt-auto text-sm text-slate-600">Redil: {teacher.redilName}</p>
                        </article>
                    ))
                ) : (
                    <p className="text-sm text-slate-600">
                        {search
                            ? `No se encontraron profesores con "${search}"`
                            : "No hay profesores registrados"}
                    </p>
                )}
            </div>

            <Pagination
                currentPage={data.currentPage}
                totalPages={data.totalPages}
                onPageChange={setPage}
            />

            <div className="mt-6">
                <a href="/teacher/register" className="btn-primary w-full sm:w-fit">
                    Registrar profesor
                </a>
            </div>
        </section>
    );
}