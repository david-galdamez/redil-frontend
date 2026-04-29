import { toast } from "@pheralb/toast";
import { useEffect, useState } from "react";
import { copyToClipboard } from "../lib/copyToClipboard";
import StudentsTab from "./StudentsTab";
import TeacherStats from "./TeacherStats";

interface Props {
    id: string;
    redil: RedilDetailsDto;
    apiUrl: string;
}

enum Tabs {
    Stats,
    Students
}

export default function RedilDetailsTeachers({ id, redil, apiUrl }: Props) {

    const redilLink = `${window.location.origin}/redil/student/${redil.redilCode}`

    const [form, setForm] = useState({
        name: redil.name,
        description: redil.description,
    });
    const [activeTab, setActiveTab] = useState(Tabs.Students)

    useEffect(() => {
        setForm({
            name: redil.name,
            description: redil.description,
        });
    }, [redil]);

    return (
        <section className="page-shell">
            <header className="page-header">
                <h1 className="page-title">Detalles del redil</h1>
            </header>

            <div className="page-card space-y-4">
                <div className="field-group">
                    <label className="label-base">Nombre</label>
                    <input
                        className="input-base"
                        name="name"
                        value={form.name}
                        disabled
                    />
                </div>
                <div className="field-group">

                    <label className="label-base">Descripción</label>
                    <textarea
                        className="input-base min-h-24"
                        name="description"
                        value={form.description}
                        disabled
                    />
                </div>
                <div className="space-y-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <p><strong>Link de asistencia:</strong></p>

                    <input
                        className="input-base"
                        type="text"
                        value={redilLink}
                        readOnly
                    />

                    <div className="actions-row pt-0!">
                        <button className="btn-secondary" onClick={() => window.open(redilLink, "_blank")}>
                            Abrir
                        </button>

                        <button className="btn-primary" onClick={() => copyToClipboard(redilLink)}>
                            Copiar link
                        </button>
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="flex border-b border-slate-200">
                        <button
                            className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === Tabs.Students
                                ? "border-b-2 border-blue-500 text-blue-600"
                                : "text-slate-500 hover:text-slate-700"
                                }`}
                            onClick={() => setActiveTab(Tabs.Students)}
                        >
                            Estudiantes
                        </button>
                        <button
                            className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === Tabs.Stats
                                ? "border-b-2 border-blue-500 text-blue-600"
                                : "text-slate-500 hover:text-slate-700"
                                }`}
                            onClick={() => setActiveTab(Tabs.Stats)}
                        >
                            Estadisticas
                        </button>
                    </div>
                    {/* Tab content */}
                    {activeTab === Tabs.Stats && (
                        <TeacherStats apiUrl={apiUrl} redilId={id} />
                    )}
                    {activeTab === Tabs.Students && (
                        <StudentsTab redilId={id} apiUrl={apiUrl} />
                    )}
                </div>
            </div>
        </section>
    );
}