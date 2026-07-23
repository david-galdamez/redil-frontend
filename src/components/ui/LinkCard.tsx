import { copyToClipboard } from "../../lib/copyToClipboard";

interface Props {
    label: string;
    link: string;
}

export default function LinkCard({ label, link }: Props) {
    return (
        <div className="p-5 rounded-2xl border border-blue-100 bg-blue-50/50 space-y-3.5 shadow-sm">
            <p className="text-sm font-bold text-[#003366]">{label}</p>
            <input
                className="w-full px-4 py-2 bg-white border border-blue-200 rounded-xl text-sm text-gray-700 select-all font-mono focus:outline-none focus:border-[#003366]"
                type="text"
                value={link}
                readOnly
            />
            <div className="flex flex-wrap gap-2 pt-1">
                <button
                    className="bg-white border border-blue-200 hover:bg-blue-100/50 text-[#003366] font-semibold py-1.5 px-4 rounded-xl text-xs transition-colors"
                    onClick={() => window.open(link, "_blank")}
                >
                    Abrir enlace
                </button>
                <button
                    className="bg-[#003366] hover:bg-[#002244] text-white font-semibold py-1.5 px-4 rounded-xl text-xs shadow-sm transition-colors"
                    onClick={() => copyToClipboard(link)}
                >
                    Copiar link
                </button>
            </div>
        </div>
    );
}