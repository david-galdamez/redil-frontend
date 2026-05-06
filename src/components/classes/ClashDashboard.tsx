import { usePaginatedFetch } from "../../hooks/usePaginatedFetch";
import { formatDateReadable } from "../../lib/formatDate";
import Pagination from "../Pagination";

interface Props {
    initialClasses: PaginatedResponse<ClassDto[]>;
    apiUrl: string;
}

export default function ClassDashboard({ initialClasses, apiUrl }: Props) {
    const { data, loading, setPage } = usePaginatedFetch({
        initialData: initialClasses,
        endpoint: "/api/class",
        apiUrl,
        basePath: "/class",
    });

    return (
        <section className="page-shell">
            <header className="page-header">
                <h1 className="page-title">Dashboard de clases</h1>
                <p className="page-subtitle">
                    Gestiona clases registradas, revisa su información y controla asistencia.
                </p>
                <p className="text-sm text-slate-500">
                    Página {data.currentPage} de {data.totalPages} —{" "}
                    {data.totalRecords} clases ({data.pageSize} por página)
                </p>
            </header>

            <div className={`card-grid card-grid-balanced transition-opacity ${loading ? "opacity-50" : ""}`}>
                {data.data.length > 0 ? (
                    data.data.map(c => (
                        <article
                            key={c.id}
                            className="item-card item-card-balanced cursor-pointer"
                            onClick={() => window.location.href = `/class/${c.id}`}
                        >
                            <h2 className="text-lg font-semibold text-slate-900">{c.redilName}</h2>
                            <p className="text-sm text-slate-600 wrap-break-word">{c.description}</p>
                            <p className="mt-auto text-sm font-medium text-slate-500">
                                {formatDateReadable(c.classDate)}
                            </p>
                        </article>
                    ))
                ) : (
                    <p className="text-sm text-slate-600">No hay clases registradas</p>
                )}
            </div>

            <Pagination
                currentPage={data.currentPage}
                totalPages={data.totalPages}
                onPageChange={setPage}
            />

            <div className="mt-6">
                <a href="/class/register" className="btn-primary w-full sm:w-fit">
                    Registrar clase
                </a>
            </div>
        </section>
    );
}