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
        <>
            <div className="mb-4">
                <input
                    className="input-base"
                    type="search"
                    placeholder="Buscar redil..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {filtered.length > 0 ? (
                <div className="card-grid">
                    {filtered.map((redil) => (
                        <article
                            key={redil.id}
                            className="item-card cursor-pointer"
                            onClick={() => window.location.href = `/redil/${redil.id}`}
                        >
                            <h2 className="text-lg font-semibold text-slate-900">
                                {redil.name}
                            </h2>
                        </article>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-slate-600">
                    {search
                        ? `No se encontraron rediles con "${search}"`
                        : "No hay rediles registradas"}
                </p>
            )}
        </>
    );
}