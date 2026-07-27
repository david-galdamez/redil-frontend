import { copyToClipboard } from "../../lib/copyToClipboard";

interface Props {
  assistLink: string;
  expired: boolean;
}

export default function AttendanceLinkCard({ assistLink, expired }: Props) {
  if (!assistLink) return null;

  if (expired) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
        <i className="ti ti-clock-off text-xl text-red-600"></i>
        <p className="text-sm font-medium text-red-700">
          El tiempo para pasar asistencia ya ha expirado
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3.5 rounded-2xl border border-blue-100 bg-blue-50/50 p-5 shadow-sm">
      <p className="text-sm font-bold text-[#003366]">Link de asistencia:</p>
      <input
        className="w-full rounded-xl border border-blue-200 bg-white px-4 py-2.5 font-mono text-sm text-gray-700 select-all focus:border-[#003366] focus:outline-none"
        type="text"
        value={assistLink}
        readOnly
      />
      <div className="flex flex-wrap gap-2 pt-1">
        <button
          className="rounded-xl border border-blue-200 bg-white px-5 py-2 text-sm font-semibold text-[#003366] transition-colors hover:bg-blue-100/50"
          onClick={() => window.open(assistLink, "_blank")}
        >
          Abrir enlace
        </button>
        <button
          className="flex items-center gap-2 rounded-xl bg-[#003366] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#002244]"
          onClick={() => copyToClipboard(assistLink)}
        >
          <i className="ti ti-copy"></i>
          Copiar link
        </button>
      </div>
    </div>
  );
}
