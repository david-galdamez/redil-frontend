import { useState, useEffect, useCallback, useRef } from "react";
import { useDebounce } from "./useDebounce";

interface Options<T> {
    initialData: PaginatedResponse<T>;
    endpoint: string;
    apiUrl: string;
    basePath: string;
    initialSearch?: string;
    credentials?: RequestCredentials;
}

export function usePaginatedFetch<T>({
    initialData,
    endpoint,
    apiUrl,
    basePath,
    initialSearch = "",
    credentials = "same-origin",
}: Options<T>) {
    const [page, setPage] = useState(initialData.currentPage);
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState(initialSearch);

    const debouncedSearch = useDebounce(search, 500);
    const isFirstRender = useRef(true);
    const prevSearch = useRef(debouncedSearch);

    const fetchPage = useCallback(async (currentPage: number, searchTerm: string) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page: String(currentPage) });
            if (searchTerm) params.set("search", searchTerm);

            const res = await fetch(`${apiUrl}${endpoint}?${params}`, { credentials });
            const json = (await res.json()) as ApiResponse<PaginatedResponse<T>>;
            if (json.success && json.data) setData(json.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [apiUrl, endpoint, credentials]);

    useEffect(() => {
        if (prevSearch.current !== debouncedSearch) {
            prevSearch.current = debouncedSearch;
            setPage(1);
        }
    }, [debouncedSearch]);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        fetchPage(page, debouncedSearch);

        const params = new URLSearchParams();
        if (debouncedSearch) params.set("search", debouncedSearch);
        if (page > 1) params.set("page", String(page));
        window.history.replaceState({}, "", `${basePath}${params.size ? `?${params}` : ""}`);
    }, [page, debouncedSearch, fetchPage, basePath]);

    return { data, loading, page, setPage, search, setSearch };
}