import { usePaginatedFetch } from "../../hooks/usePaginatedFetch";
import { formatDateReadable } from "../../lib/formatDate";
import Pagination from "../Pagination";

interface Props {
  initialClasses: PaginatedResponse<ClassDto[]>;
}

export default function ClassDashboard({ initialClasses }: Props) {
  const { data, loading, setPage } = usePaginatedFetch({
    initialData: initialClasses,
    endpoint: "api/class",
    basePath: "/class",
  });

  return (
    <section className="space-y-6">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-[#003366] md:text-3xl">Dashboard de clases</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gestiona clases registradas, revisa su información y controla asistencia.
        </p>
        <div className="mt-3 inline-block rounded-xl border border-gray-100 bg-white px-4 py-2 text-xs font-medium text-gray-500 shadow-sm">
          Página {data.currentPage} de {data.totalPages} — {data.totalRecords} clases (
          {data.pageSize} por página)
        </div>
      </header>

      <div
        className={`grid gap-4 transition-opacity duration-200 sm:grid-cols-2 lg:grid-cols-3 ${loading ? "opacity-50" : ""}`}
      >
        {data.data.length > 0 ? (
          data.data.map((c) => (
            <article
              key={c.id}
              className="group flex cursor-pointer flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-[#003366]/30 hover:shadow-md"
              onClick={() => (window.location.href = `/class/${c.id}`)}
            >
              <h2 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-[#003366]">
                {c.redilName}
              </h2>
              <p className="line-clamp-3 text-sm break-words text-gray-600">{c.description}</p>
              <p className="mt-auto flex items-center gap-2 border-t border-gray-50 pt-3 text-xs font-semibold text-gray-400">
                <i className="ti ti-calendar" aria-hidden="true"></i>
                {formatDateReadable(c.classDate)}
              </p>
            </article>
          ))
        ) : (
          <div className="col-span-full rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-10 text-center">
            <p className="text-sm font-medium text-gray-500">No hay clases registradas</p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <Pagination
          currentPage={data.currentPage}
          totalPages={data.totalPages}
          onPageChange={setPage}
        />

        <a
          href="/class/register"
          className="block w-full rounded-xl bg-[#003366] px-6 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#002244] sm:w-fit"
        >
          Registrar clase
        </a>
      </div>
    </section>
  );
}
