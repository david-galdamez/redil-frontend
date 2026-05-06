import { formatDateLocal } from "../../lib/formatDate";
import { usePassAssist } from "../../hooks/usePassAssist";
import AttendanceLinkCard from "./AttendanceLinkCard";

interface Props {
    apiUrl: string;
    classDetails: ClassDetailsDto;
}

export default function ClassDetails({ apiUrl, classDetails }: Props) {
    const { passAssist, loading } = usePassAssist(apiUrl, classDetails.classId);
    const assistLink = classDetails.attendanceToken
        ? `${window.location.origin}/assist/${classDetails.attendanceToken}`
        : null;

    return (
        <section className="page-shell">
            <header className="page-header">
                <h1 className="page-title">Detalles de clase</h1>
                <p className="page-subtitle">Información general y control de asistencia.</p>
            </header>

            <div className="page-card space-y-4">
                <div className="field-group">
                    <label className="label-base" htmlFor="description">Descripción de la clase</label>
                    <textarea
                        className="input-base min-h-24"
                        name="description"
                        id="description"
                        defaultValue={classDetails.classDescription}
                        disabled
                    />
                </div>

                <div className="field-group">
                    <label className="label-base" htmlFor="date">Fecha de la clase</label>
                    <input
                        className="input-base"
                        type="datetime-local"
                        name="date"
                        id="date"
                        defaultValue={formatDateLocal(classDetails.classDate)}
                        disabled
                    />
                </div>

                {assistLink && (
                    <AttendanceLinkCard
                        assistLink={assistLink}
                        expired={classDetails.expired}
                    />
                )}

                <button
                    className="btn-primary w-full sm:w-fit"
                    onClick={passAssist}
                    disabled={classDetails.attendanceToken !== null || classDetails.expired || loading}
                >
                    {loading ? "Iniciando..." : "Iniciar asistencia"}
                </button>
            </div>
        </section>
    );
}