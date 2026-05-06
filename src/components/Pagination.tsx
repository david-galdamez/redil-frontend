export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}) {
    if (totalPages <= 1) return null;

    const range = 2;
    const start = Math.max(1, currentPage - range);
    const end = Math.min(totalPages, currentPage + range);
    const pages: (number | "...")[] = [];

    if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push("...");
    }
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages) {
        if (end < totalPages - 1) pages.push("...");
        pages.push(totalPages);
    }

    return (
        <nav className="flex flex-wrap gap-1 mt-4 items-center">
            <button
                className="pagination-btn"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                ← Anterior
            </button>

            {pages.map((page, i) =>
                page === "..." ? (
                    <span key={`ellipsis-${i}`} className="px-2 text-slate-400">…</span>
                ) : (
                    <button
                        key={page}
                        className={`pagination-btn ${page === currentPage ? "pagination-btn-active" : ""}`}
                        onClick={() => onPageChange(page as number)}
                        aria-current={page === currentPage ? "page" : undefined}
                    >
                        {page}
                    </button>
                )
            )}

            <button
                className="pagination-btn"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Siguiente →
            </button>
        </nav>
    );
}