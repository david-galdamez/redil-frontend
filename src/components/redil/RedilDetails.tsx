import { useRedilForm } from "../../hooks/useRedilForm";
import StudentsTab from "../student/StudentsTab";
import LinkCard from "../ui/LinkCard";
import RedilTabs from "./RedilTabs";
import TeachersTab from "./TeachersTab";

interface Props {
    id: string;
    redil: RedilDetailsDto;
    apiUrl: string;
}

enum Tabs { Teachers, Students }

export default function RedilDetails({ id, redil, apiUrl }: Props) {
    const { editing, setEditing, form, errors, loading, handleChange, handleCancel, handleSubmit } =
        useRedilForm(id, redil, apiUrl);

    const redilLink = `${window.location.origin}/redil/student/${redil.redilCode}`;

    return (
        <section className="space-y-6">
            <header className="mb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-[#003366]">Detalles del redil</h1>
                <p className="text-sm text-gray-500 mt-1">Consulta y edita la información principal del redil.</p>
            </header>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
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
                    <label className="text-sm font-semibold text-gray-700">Descripción</label>
                    <textarea
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#003366] focus:bg-white transition-colors text-gray-800 min-h-[96px] resize-y disabled:opacity-75 disabled:cursor-not-allowed"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        disabled={!editing}
                    />
                    {errors.description && <p className="text-xs font-medium text-red-600 mt-1">{errors.description}</p>}
                </div>

                <div className="pt-2">
                    <LinkCard label="Link de registro:" link={redilLink} />
                </div>

                {errors.general && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
                        <p className="text-xs font-medium text-red-600 text-center">{errors.general}</p>
                    </div>
                )}

                <div className="pt-4 border-t border-gray-50">
                    <RedilTabs
                        tabs={[
                            { id: Tabs.Teachers, label: "Profesores" },
                            { id: Tabs.Students, label: "Estudiantes" },
                        ]}
                        renderTab={activeTab => (
                            <div className="mt-4">
                                {activeTab === Tabs.Teachers && <TeachersTab teachers={redil.teacherList} />}
                                {activeTab === Tabs.Students && <StudentsTab redilId={id} apiUrl={apiUrl} />}
                            </div>
                        )}
                    />
                </div>

                <div className="pt-4 flex flex-wrap gap-3">
                    {!editing ? (
                        <button
                            className="bg-[#003366] hover:bg-[#002244] text-white font-medium py-2 px-6 rounded-xl text-sm shadow-sm transition-colors"
                            onClick={() => setEditing(true)}
                        >
                            Editar redil
                        </button>
                    ) : (
                        <>
                            <button
                                className="bg-[#003366] hover:bg-[#002244] text-white font-medium py-2 px-6 rounded-xl text-sm shadow-sm transition-colors disabled:opacity-50"
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