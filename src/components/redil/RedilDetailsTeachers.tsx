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
        <section className="page-shell">
            <header className="page-header">
                <h1 className="page-title">Detalles del redil</h1>
            </header>

            <div className="page-card space-y-4">
                <div className="field-group">
                    <label className="label-base">Nombre</label>
                    <input className="input-base" value={redil.name} disabled />
                </div>

                <div className="field-group">
                    <label className="label-base">Descripción</label>
                    <textarea className="input-base min-h-24" value={redil.description} disabled />
                </div>

                <LinkCard label="Link de asistencia:" link={redilLink} />

                <RedilTabs
                    tabs={TAB_LIST}
                    renderTab={activeTab => (
                        <>
                            {activeTab === Tabs.Stats && <TeacherStats apiUrl={apiUrl} redilId={id} />}
                            {activeTab === Tabs.Students && <StudentsTab redilId={id} apiUrl={apiUrl} />}
                        </>
                    )}
                />
            </div>
        </section>
    );
}