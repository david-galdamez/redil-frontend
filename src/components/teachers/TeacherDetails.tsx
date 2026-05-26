import { useTeacherForm } from "../../hooks/useTeacherForm";

interface Props {
    id: string;
    teacher: TeacherDetailsDto;
    redils: RedilDto[];
    apiUrl: string;
}

export default function TeacherDetails({ id, teacher, redils, apiUrl }: Props) {
    const { editing, setEditing, form, errors, loading, handleChange, handleCancel, handleSubmit } =
        useTeacherForm(id, teacher, apiUrl);

    return (
        <section className="space-y-6">
            <header className="mb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-[#003366]">Detalles del profesor</h1>
                <p className="text-sm text-gray-500 mt-1">Administra sus datos y estado de actividad.</p>
            </header>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-gray-700">Nombre</label>
                        <input
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#003366] focus:bg-white transition-colors text-gray-800 disabled:opacity-75 disabled:cursor-not-allowed"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            disabled={!editing}
                        />
                        {errors.name && <p className="text-xs font-medium text-red-600 mt-1">{errors.name}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-gray-700">Email</label>
                        <input
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#003366] focus:bg-white transition-colors text-gray-800 disabled:opacity-75 disabled:cursor-not-allowed"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            disabled={!editing}
                        />
                        {errors.email && <p className="text-xs font-medium text-red-600 mt-1">{errors.email}</p>}
                    </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2 items-end">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-gray-700">Redil</label>
                        <select
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#003366] focus:bg-white transition-colors text-gray-800 h-[46px] disabled:opacity-75 disabled:cursor-not-allowed appearance-none"
                            name="redilId"
                            value={form.redilId}
                            onChange={handleChange}
                            disabled={!editing}
                        >
                            {redils.map((r) => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                        </select>
                    </div>

                    <label className={`inline-flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 cursor-pointer select-none h-[46px] transition-colors ${!editing ? 'bg-gray-100 opacity-75 cursor-not-allowed' : 'bg-gray-50 hover:bg-gray-100'}`}>
                        <input
                            className="w-4 h-4 rounded border-gray-300 text-[#003366] focus:ring-[#003366] disabled:opacity-50"
                            name="active"
                            type="checkbox"
                            checked={form.active}
                            onChange={handleChange}
                            disabled={!editing}
                        />
                        Docente activo en el sistema
                    </label>
                </div>

                {errors.general && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
                        <p className="text-xs font-medium text-red-600 text-center">{errors.general}</p>
                    </div>
                )}

                <div className="pt-4 border-t border-gray-50 flex flex-wrap gap-3">
                    {!editing ? (
                        <button
                            className="bg-[#003366] hover:bg-[#002244] text-white font-medium py-2 px-5 rounded-xl text-sm shadow-sm transition-colors"
                            onClick={() => setEditing(true)}
                        >
                            Editar datos
                        </button>
                    ) : (
                        <>
                            <button
                                className="bg-[#003366] hover:bg-[#002244] text-white font-medium py-2 px-5 rounded-xl text-sm shadow-sm transition-colors disabled:opacity-50"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? "Guardando..." : "Guardar cambios"}
                            </button>
                            <button
                                className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 font-medium py-2 px-5 rounded-xl text-sm transition-colors"
                                onClick={handleCancel}
                            >
                                Cancelar
                            </button>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}