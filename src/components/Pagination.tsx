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
        <nav className="flex flex-wrap gap-1.5 mt-6 items-center justify-center sm:justify-start">
            <button
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium bg-white text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                ← Anterior
            </button>

            {pages.map((page, i) =>
                page === "..." ? (
                    <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-sm">…</span>
                ) : (
                    <button
                        key={page}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${page === currentPage
                                ? "bg-[#003366] border-[#003366] text-white"
                                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                            }`}
                        onClick={() => onPageChange(page as number)}
                        aria-current={page === currentPage ? "page" : undefined}
                    >
                        {page}
                    </button>
                )
            )}

            <button
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium bg-white text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Siguiente →
            </button>
        </nav>
    );
}