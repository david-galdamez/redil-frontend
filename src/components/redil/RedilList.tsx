import { useState } from "react";

interface Props {
    redils: RedilListDto[];
}

export default function RedilList({ redils }: Props) {
    const [search, setSearch] = useState("");

    const filtered = redils.filter((r) =>
        r.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="relative">
                <input
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#003366] focus:bg-white transition-colors text-gray-800 shadow-sm"
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
                            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#003366]/30 cursor-pointer flex flex-col justify-between gap-2 transition-all group"
                            onClick={() => window.location.href = `/redil/${redil.id}`}
                        >
                            <h2 className="text-lg font-bold text-gray-900 group-hover:text-[#003366] transition-colors">
                                {redil.name}
                            </h2>
                            <div className="text-xs font-semibold text-[#003366] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                Ver detalles
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                            </div>
                        </article>
                    ))}
                </div>
            ) : (
                <div className="py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-sm text-gray-500 font-medium">
                        {search
                            ? `No se encontraron rediles con "${search}"`
                            : "No hay rediles registradas"}
                    </p>
                </div>
            )}
        </div>
    );
}