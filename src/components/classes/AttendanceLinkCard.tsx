import { copyToClipboard } from "../../lib/copyToClipboard";

interface Props {
    assistLink: string;
    expired: boolean;
}

export default function AttendanceLinkCard({ assistLink, expired }: Props) {
    if (!assistLink) return null;

    if (expired) {
        return (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
                <i className="ti ti-clock-off text-red-600 text-xl"></i>
                <p className="text-sm font-medium text-red-700">El tiempo para pasar asistencia ya ha expirado</p>
            </div>
        );
    }

    return (
        <div className="p-5 rounded-2xl border border-blue-100 bg-blue-50/50 space-y-3.5 shadow-sm">
            <p className="text-sm font-bold text-[#003366]">Link de asistencia:</p>
            <input
                className="w-full px-4 py-2.5 bg-white border border-blue-200 rounded-xl text-sm text-gray-700 select-all font-mono focus:outline-none focus:border-[#003366]"
                type="text"
                value={assistLink}
                readOnly
            />
            <div className="flex flex-wrap gap-2 pt-1">
                <button
                    className="bg-white border border-blue-200 hover:bg-blue-100/50 text-[#003366] font-semibold py-2 px-5 rounded-xl text-sm transition-colors"
                    onClick={() => window.open(assistLink, "_blank")}
                >
                    Abrir enlace
                </button>
                <button
                    className="bg-[#003366] hover:bg-[#002244] text-white font-semibold py-2 px-5 rounded-xl text-sm shadow-sm transition-colors flex items-center gap-2"
                    onClick={() => copyToClipboard(assistLink)}
                >
                    <i className="ti ti-copy"></i>
                    Copiar link
                </button>
            </div>
        </div>
    );
}