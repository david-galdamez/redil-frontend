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
    <nav className="mt-6 flex flex-wrap items-center justify-center gap-1.5 sm:justify-start">
      <button
        className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ← Anterior
      </button>

      {pages.map((page, i) =>
        page === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-sm text-gray-400">
            …
          </span>
        ) : (
          <button
            key={page}
            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
              page === currentPage
                ? "border-[#003366] bg-[#003366] text-white"
                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => onPageChange(page as number)}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </button>
        )
      )}

      <button
        className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Siguiente →
      </button>
    </nav>
  );
}
