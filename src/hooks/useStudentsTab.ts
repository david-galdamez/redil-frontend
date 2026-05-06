import { useState, useEffect } from "react";
import { useDebounce } from "./useDebounce";
import type { StudentListDto } from "../types/students";

export function useStudentsTab(redilId: string, apiUrl: string) {
    const [students, setStudents] = useState<StudentListDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");

    const debouncedSearch = useDebounce(search, 500);

    // Resetea a página 1 cuando cambia la búsqueda
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true);
            setError(null);
            try {
                const params = new URLSearchParams({ page: String(page) });
                if (debouncedSearch) params.set("search", debouncedSearch);

                const res = await fetch(`${apiUrl}/api/student/redil/${redilId}?${params}`, {
                    credentials: "include",
                });
                const resData = (await res.json()) as ApiResponse<PaginatedResponse<StudentListDto[]>>;

                if (!res.ok || resData.data === undefined) {
                    setError(resData.message || "Error cargando estudiantes");
                    return;
                }

                setStudents(resData.data?.data ?? []);
                setTotalPages(resData.data?.totalPages ?? 1);
            } catch {
                setError("Error de red al cargar estudiantes");
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [redilId, page, debouncedSearch, apiUrl]);

    return { students, loading, error, page, setPage, totalPages, search, setSearch };
}