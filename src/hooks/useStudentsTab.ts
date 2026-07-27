import { useState, useEffect } from "react";
import { useDebounce } from "./useDebounce";
import type { StudentListDto } from "../types/students";
import { apiClient } from "../lib/api/client";

export function useStudentsTab(redilId: string) {
  const [students, setStudents] = useState<StudentListDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);

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

        const result = await apiClient.get<PaginatedResponse<StudentListDto[]>>(
          `api/student/redil/${redilId}?${params}`
        );

        if (result.error || result.data === null) {
          setError(result.error || "Error cargando estudiantes");
          return;
        }

        setStudents(result.data?.data ?? []);
        setTotalPages(result.data?.totalPages ?? 1);
      } catch {
        setError("Error de red al cargar estudiantes");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [redilId, page, debouncedSearch]);

  return { students, loading, error, page, setPage, totalPages, search, setSearch };
}
