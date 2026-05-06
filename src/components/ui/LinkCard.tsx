import { copyToClipboard } from "../../lib/copyToClipboard";

interface Props {
    label: string;
    link: string;
}

export default function LinkCard({ label, link }: Props) {
    return (
        <div className="space-y-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p><strong>{label}</strong></p>
            <input className="input-base" type="text" value={link} readOnly />
            <div className="actions-row pt-0!">
                <button className="btn-secondary" onClick={() => window.open(link, "_blank")}>
                    Abrir
                </button>
                <button className="btn-primary" onClick={() => copyToClipboard(link)}>
                    Copiar link
                </button>
            </div>
        </div>
    );
}