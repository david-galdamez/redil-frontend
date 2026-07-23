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
        <h1 className="text-2xl md:text-3xl font-bold text-[#003366]">Dashboard de clases</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gestiona clases registradas, revisa su información y controla asistencia.
        </p>
        <div className="inline-block mt-3 bg-white border border-gray-100 rounded-xl px-4 py-2 shadow-sm text-xs text-gray-500 font-medium">
          Página {data.currentPage} de {data.totalPages} —{" "}
          {data.totalRecords} clases ({data.pageSize} por página)
        </div>
      </header>

      <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 transition-opacity duration-200 ${loading ? "opacity-50" : ""}`}>
        {data.data.length > 0 ? (
          data.data.map(c => (
            <article
              key={c.id}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#003366]/30 cursor-pointer flex flex-col gap-3 transition-all group"
              onClick={() => window.location.href = `/class/${c.id}`}
            >
              <h2 className="text-lg font-bold text-gray-900 group-hover:text-[#003366] transition-colors">{c.redilName}</h2>
              <p className="text-sm text-gray-600 break-words line-clamp-3">{c.description}</p>
              <p className="mt-auto pt-3 border-t border-gray-50 text-xs font-semibold text-gray-400 flex items-center gap-2">
                <i className="ti ti-calendar" aria-hidden="true"></i>
                {formatDateReadable(c.classDate)}
              </p>
            </article>
          ))
        ) : (
          <div className="col-span-full py-10 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-sm text-gray-500 font-medium">No hay clases registradas</p>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-100">
        <Pagination
          currentPage={data.currentPage}
          totalPages={data.totalPages}
          onPageChange={setPage}
        />

        <a
          href="/class/register"
          className="w-full sm:w-fit text-center bg-[#003366] hover:bg-[#002244] text-white font-medium py-2.5 px-6 rounded-xl text-sm shadow-sm transition-colors block"
        >
          Registrar clase
        </a>
      </div>
    </section>
  );
}
