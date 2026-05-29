import { useState, useEffect, useRef } from "react";

const today = new Date().toISOString().split("T")[0];
const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

export function useTeacherStats(apiUrl: string, redilId?: string) {
    const isAdmin = redilId === undefined;

    const [filters, setFilters] = useState<ClassStatsRequestDto>({
        fromDate: thirtyDaysAgo,
        toDate: today,
        redilId: isAdmin ? undefined : redilId,
        groupId: undefined,
        search: undefined,
    });
    const [groups, setGroups] = useState<GroupDto[]>([]);
    const [rediles, setRediles] = useState<RedilListDto[]>([]);
    const [stats, setStats] = useState<RedilClassStatDto[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    useEffect(() => {
        fetchGroups();
        if (isAdmin) fetchRediles();
        fetchStats(1, filters);
    }, []);

    async function fetchGroups() {
        try {
            const res = await fetch(`${apiUrl}/api/groups`, {
                credentials: "include",
            });
            const data: ApiResponse<GroupDto[]> = await res.json();
            if (data.success) setGroups(data.data ?? []);
        } catch { }
    }

    async function fetchRediles() {
        try {
            const res = await fetch(`${apiUrl}/api/redil`, {
                credentials: "include",
            });
            const data: ApiResponse<RedilListDto[]> = await res.json();
            if (data.success) setRediles(data.data ?? []);
        } catch { }
    }

    async function fetchStats(targetPage: number, currentFilters: ClassStatsRequestDto) {
        setLoading(true);
        setError(null);
        try {
            const endpoint = isAdmin
                ? `${apiUrl}/api/redil/stats?page=${targetPage}`
                : `${apiUrl}/api/teacher/redil/stats?page=${targetPage}`;

            const res = await fetch(endpoint, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(currentFilters),
            });

            const data: ApiResponse<PaginatedResponse<RedilClassStatDto[]>> = await res.json();

            if (data.success && data.data) {
                setStats(data.data.data);
                setTotalPages(data.data.totalPages);
                setPage(data.data.currentPage);
            } else {
                setError(data.message ?? "Error al cargar estadísticas.");
            }
        } catch {
            setError("Error de conexión.");
        } finally {
            setLoading(false);
        }
    }

    function handleFilterChange(partial: Partial<ClassStatsRequestDto>) {
        setFilters(prev => {
            const updated = { ...prev, ...partial };
            clearTimeout(debounceRef.current!);
            debounceRef.current = setTimeout(() => fetchStats(1, updated), 500);
            return updated;
        });
    }

    return {
        isAdmin,
        filters,
        groups,
        rediles,
        stats,
        page,
        totalPages,
        loading,
        error,
        fetchStats,
        handleFilterChange,
    };
}