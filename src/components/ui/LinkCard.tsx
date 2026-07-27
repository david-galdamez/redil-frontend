import { copyToClipboard } from "../../lib/copyToClipboard";

interface Props {
  label: string;
  link: string;
}

export default function LinkCard({ label, link }: Props) {
  return (
    <div className="space-y-3.5 rounded-2xl border border-blue-100 bg-blue-50/50 p-5 shadow-sm">
      <p className="text-sm font-bold text-[#003366]">{label}</p>
      <input
        className="w-full rounded-xl border border-blue-200 bg-white px-4 py-2 font-mono text-sm text-gray-700 select-all focus:border-[#003366] focus:outline-none"
        type="text"
        value={link}
        readOnly
      />
      <div className="flex flex-wrap gap-2 pt-1">
        <button
          className="rounded-xl border border-blue-200 bg-white px-4 py-1.5 text-xs font-semibold text-[#003366] transition-colors hover:bg-blue-100/50"
          onClick={() => window.open(link, "_blank")}
        >
          Abrir enlace
        </button>
        <button
          className="rounded-xl bg-[#003366] px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#002244]"
          onClick={() => copyToClipboard(link)}
        >
          Copiar link
        </button>
      </div>
    </div>
  );
}
