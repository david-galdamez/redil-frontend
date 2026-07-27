import { useState, useEffect, useCallback, useRef } from "react";
import { useDebounce } from "./useDebounce";
import { apiClient } from "../lib/api/client";

interface Options<T> {
  initialData: PaginatedResponse<T>;
  endpoint: string;
  basePath: string;
  initialSearch?: string;
  filters?: Record<string, string>;
}

export function usePaginatedFetch<T>({
  initialData,
  endpoint,
  basePath,
  initialSearch = "",
  filters = {},
}: Options<T>) {
  const [page, setPage] = useState(initialData.currentPage);
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(initialSearch);

  const debouncedSearch = useDebounce(search, 500);
  const isFirstRender = useRef(true);
  const prevSearch = useRef(debouncedSearch);
  const filtersRef = useRef(filters);
  const filtersKey = JSON.stringify(filters);
  const prevFiltersKey = useRef(filtersKey);

  filtersRef.current = filters;

  const filterChanged = prevFiltersKey.current !== filtersKey;
  if (filterChanged) {
    prevFiltersKey.current = filtersKey;
  }

  const [filtersVersion, setFiltersVersion] = useState(0);

  const fetchPage = useCallback(
    async (currentPage: number, searchTerm: string) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: String(currentPage) });
        if (searchTerm) params.set("search", searchTerm);
        const current = filtersRef.current;
        Object.entries(current).forEach(([k, v]) => {
          if (v) params.set(k, v);
        });

        const result = await apiClient.get<PaginatedResponse<T>>(`${endpoint}?${params}`);
        if (result.data) setData(result.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [endpoint]
  );

  useEffect(() => {
    if (prevSearch.current !== debouncedSearch) {
      prevSearch.current = debouncedSearch;
      setPage(1);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (filterChanged) {
      setPage(1);
      setFiltersVersion((v) => v + 1);
    }
  }, [filterChanged]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    fetchPage(page, debouncedSearch);

    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (page > 1) params.set("page", String(page));
    const current = filtersRef.current;
    Object.entries(current).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    window.history.replaceState({}, "", `${basePath}${params.size ? `?${params}` : ""}`);
  }, [page, debouncedSearch, fetchPage, basePath, filtersVersion]);

  return { data, loading, page, setPage, search, setSearch };
}
