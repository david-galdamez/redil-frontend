import { copyToClipboard } from "../../lib/copyToClipboard";

interface Props {
    assistLink: string;
    expired: boolean;
}

export default function AttendanceLinkCard({ assistLink, expired }: Props) {
    if (!assistLink) return null;

    if (expired) {
        return <p className="error-text">El tiempo para pasar asistencia ya ha expirado</p>;
    }

    return (
        <div className="space-y-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p><strong>Link de asistencia:</strong></p>
            <input className="input-base" type="text" value={assistLink} readOnly />
            <div className="actions-row pt-0!">
                <button className="btn-secondary" onClick={() => window.open(assistLink, "_blank")}>
                    Abrir
                </button>
                <button className="btn-primary" onClick={() => copyToClipboard(assistLink)}>
                    Copiar link
                </button>
            </div>
        </div>
    );
}