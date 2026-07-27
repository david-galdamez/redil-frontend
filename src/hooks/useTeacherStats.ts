import { useState, useEffect, useRef } from "react";
import { apiClient } from "../lib/api/client";

const today = new Date().toISOString().split("T")[0];
const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

export function useTeacherStats(redilId?: string) {
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
    const result = await apiClient.get<GroupDto[]>("api/groups");
    if (result.data) setGroups(result.data);
  }

  async function fetchRediles() {
    const result = await apiClient.get<RedilListDto[]>("api/redil");
    if (result.data) setRediles(result.data);
  }

  async function fetchStats(targetPage: number, currentFilters: ClassStatsRequestDto) {
    setLoading(true);
    setError(null);
    try {
      const endpoint = isAdmin
        ? `api/redil/stats?page=${targetPage}`
        : `api/teacher/redil/stats?page=${targetPage}`;

      const result = await apiClient.post<PaginatedResponse<RedilClassStatDto[]>>(
        endpoint,
        currentFilters
      );

      if (result.data) {
        setStats(result.data.data);
        setTotalPages(result.data.totalPages);
        setPage(result.data.currentPage);
      } else {
        setError(result.error ?? "Error al cargar estadísticas.");
      }
    } catch {
      setError("Error de conexión.");
    } finally {
      setLoading(false);
    }
  }

  function handleFilterChange(partial: Partial<ClassStatsRequestDto>) {
    setFilters((prev) => {
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
