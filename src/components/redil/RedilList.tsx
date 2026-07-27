import { useState } from "react";

interface Props {
  redils: RedilListDto[];
}

export default function RedilList({ redils }: Props) {
  const [search, setSearch] = useState("");

  const filtered = redils.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="relative">
        <input
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 shadow-sm transition-colors focus:border-[#003366] focus:bg-white focus:outline-none"
          type="search"
          placeholder="Buscar redil por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((redil) => (
            <article
              key={redil.id}
              className="group flex cursor-pointer flex-col justify-between gap-2 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-[#003366]/30 hover:shadow-md"
              onClick={() => (window.location.href = `/redil/${redil.id}`)}
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-[#003366]">
                  {redil.name}
                </h2>
                <span className="inline-block shrink-0 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                  Curso #{redil.numCourse}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-[#003366] opacity-0 transition-opacity group-hover:opacity-100">
                Ver detalles
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-12 text-center">
          <p className="text-sm font-medium text-gray-500">
            {search ? `No se encontraron rediles con "${search}"` : "No hay rediles registradas"}
          </p>
        </div>
      )}
    </div>
  );
}
