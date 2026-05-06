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
        <section className="page-shell">
            <header className="page-header">
                <h1 className="page-title">Detalles de la redil</h1>
                <p className="page-subtitle">Consulta y edita la información principal de la redil.</p>
            </header>

            <div className="page-card space-y-4">
                <div className="field-group">
                    <label className="label-base">Nombre</label>
                    <input
                        className="input-base"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        disabled={!editing}
                    />
                    {errors.name && <p className="error-text">{errors.name}</p>}
                </div>

                <div className="field-group">
                    <label className="label-base">Descripción</label>
                    <textarea
                        className="input-base min-h-24"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        disabled={!editing}
                    />
                    {errors.description && <p className="error-text">{errors.description}</p>}
                </div>

                <LinkCard label="Link de registro:" link={redilLink} />

                {errors.general && <p className="error-text">{errors.general}</p>}

                <RedilTabs
                    tabs={[
                        { id: Tabs.Teachers, label: "Profesores" },
                        { id: Tabs.Students, label: "Estudiantes" },
                    ]}
                    renderTab={activeTab => (
                        <>
                            {activeTab === Tabs.Teachers && <TeachersTab teachers={redil.teacherList} />}
                            {activeTab === Tabs.Students && <StudentsTab redilId={id} apiUrl={apiUrl} />}
                        </>
                    )}
                />

                <div className="actions-row">
                    {!editing ? (
                        <button className="btn-primary" onClick={() => setEditing(true)}>Editar</button>
                    ) : (
                        <>
                            <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
                                {loading ? "Guardando..." : "Guardar"}
                            </button>
                            <button className="btn-secondary" onClick={handleCancel}>Cancelar</button>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}