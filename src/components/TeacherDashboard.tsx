import { useState, useEffect, useCallback, useRef } from "react";
import { useDebounce } from "../hooks/useDebounce";

interface Props {
    initialTeachers: PaginatedResponse<TeacherDto[]>;
    initialSearch: string;
    apiUrl: string;
}

export default function TeacherDashboard({ initialTeachers, initialSearch, apiUrl }: Props) {
    const [search, setSearch] = useState(initialSearch);
    const [page, setPage] = useState(initialTeachers.currentPage);
    const [data, setData] = useState(initialTeachers);
    const [loading, setLoading] = useState(false);

    const debouncedSearch = useDebounce(search, 500);
    const isFirstRender = useRef(true);
    const prevSearch = useRef(debouncedSearch);

    const fetchTeachers = useCallback(async (searchTerm: string, currentPage: number) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchTerm) params.set("search", searchTerm);
            params.set("page", String(currentPage));
            const res = await fetch(`${apiUrl}/api/teacher?${params}`, {
                credentials: "include"
            }
            );
            const json = (await res.json()) as ApiResponse<PaginatedResponse<TeacherDto[]>>;
            if (json.success && json.data) setData(json.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [apiUrl]);

    // Resetea a página 1 cuando cambia la búsqueda
    useEffect(() => {
        if (prevSearch.current !== debouncedSearch) {
            prevSearch.current = debouncedSearch;
            setPage(1);
        }
    }, [debouncedSearch]);

    // Fetch + sync URL (skippea el primer render porque ya hay datos SSR)
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        fetchTeachers(debouncedSearch, page);

        const params = new URLSearchParams();
        if (debouncedSearch) params.set("search", debouncedSearch);
        if (page > 1) params.set("page", String(page));
        window.history.replaceState({}, "", `/teacher${params.size ? `?${params}` : ""}`);
    }, [debouncedSearch, page, fetchTeachers]);

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

            <div className="mt-6 flex justify-between items-center">
                <a href="/teacher/register" className="btn-primary w-full sm:w-fit">
                    Registrar profesor
                </a>
                <div className="flex gap-2 items-center">
                    <button
                        className="btn-secondary"
                        disabled={data.currentPage <= 1 || loading}
                        onClick={() => setPage(p => p - 1)}
                    >
                        Anterior
                    </button>
                    <button
                        className="btn-secondary"
                        disabled={data.currentPage >= data.totalPages || loading}
                        onClick={() => setPage(p => p + 1)}
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </section>
    );
}