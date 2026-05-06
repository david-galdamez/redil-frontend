import { useState, useEffect, useCallback, useRef } from "react";
import Pagination from "./Pagination";
import { formatDateReadable } from "../lib/formatDate";

interface Props {
    initialClasses: PaginatedResponse<ClassDto[]>;
    apiUrl: string;
}

export default function ClassDashboard({ initialClasses, apiUrl }: Props) {
    const [page, setPage] = useState(initialClasses.currentPage);
    const [data, setData] = useState(initialClasses);
    const [loading, setLoading] = useState(false);
    const isFirstRender = useRef(true);

    const fetchClasses = useCallback(async (currentPage: number) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page: String(currentPage) });
            const res = await fetch(`${apiUrl}/api/class?${params}`);
            const json = (await res.json()) as ApiResponse<PaginatedResponse<ClassDto[]>>;
            if (json.success && json.data) setData(json.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [apiUrl]);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        fetchClasses(page);

        const params = new URLSearchParams();
        if (page > 1) params.set("page", String(page));
        window.history.replaceState({}, "", `/class${params.size ? `?${params}` : ""}`);
    }, [page, fetchClasses]);

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