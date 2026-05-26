import LinkCard from "../ui/LinkCard";
import RedilTabs from "./RedilTabs";
import StudentsTab from "../student/StudentsTab";
import TeacherStats from "../stats/TeacherStats";

interface Props {
    id: string;
    redil: RedilDetailsDto;
    apiUrl: string;
}

enum Tabs { Students, Stats }

const TAB_LIST = [
    { id: Tabs.Students, label: "Estudiantes" },
    { id: Tabs.Stats, label: "Estadísticas" },
] as const;

export default function RedilDetailsTeacher({ id, redil, apiUrl }: Props) {
    const redilLink = `${window.location.origin}/redil/student/${redil.redilCode}`;

    return (
        <section className="space-y-6">
            <header className="mb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-[#003366]">Detalles del redil</h1>
                <p className="text-sm text-gray-500 mt-1">Gestión de tu redil asignado.</p>
            </header>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-700">Nombre</label>
                    <input
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 disabled:opacity-75 disabled:cursor-not-allowed"
                        value={redil.name}
                        disabled
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-700">Descripción</label>
                    <textarea
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 min-h-[96px] resize-none disabled:opacity-75 disabled:cursor-not-allowed"
                        value={redil.description}
                        disabled
                    />
                </div>

                <div className="pt-2">
                    <LinkCard label="Link de asistencia:" link={redilLink} />
                </div>

                <div className="pt-4 border-t border-gray-50">
                    <RedilTabs
                        tabs={TAB_LIST}
                        renderTab={activeTab => (
                            <div className="mt-4">
                                {activeTab === Tabs.Stats && <TeacherStats apiUrl={apiUrl} redilId={id} />}
                                {activeTab === Tabs.Students && <StudentsTab redilId={id} apiUrl={apiUrl} />}
                            </div>
                        )}
                    />
                </div>
            </div>
        </section>
    );
}