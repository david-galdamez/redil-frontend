import { formatDateLocal } from "../../lib/formatDate";
import { usePassAssist } from "../../hooks/usePassAssist";
import AttendanceLinkCard from "./AttendanceLinkCard";

interface Props {
  classDetails: ClassDetailsDto;
}

export default function ClassDetails({ classDetails }: Props) {
  const { passAssist, loading } = usePassAssist(classDetails.classId);
  const assistLink = classDetails.attendanceToken
    ? `${window.location.origin}/assist/${classDetails.attendanceToken}`
    : null;

  return (
    <section className="space-y-6">
      <header className="mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-[#003366]">Detalles de clase</h1>
        <p className="text-sm text-gray-500 mt-1">Información general y control de asistencia.</p>
      </header>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700" htmlFor="description">Descripción de la clase</label>
          <textarea
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 min-h-[96px] resize-y opacity-90 cursor-not-allowed"
            name="description"
            id="description"
            defaultValue={classDetails.classDescription}
            disabled
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700" htmlFor="date">Fecha de la clase</label>
          <input
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 opacity-90 cursor-not-allowed"
            type="datetime-local"
            name="date"
            id="date"
            defaultValue={formatDateLocal(classDetails.classDate)}
            disabled
          />
        </div>

        {assistLink && (
          <div className="pt-2">
            <AttendanceLinkCard
              assistLink={assistLink}
              expired={classDetails.expired}
            />
          </div>
        )}

        <div className="pt-4 border-t border-gray-50">
          <button
            className="w-full sm:w-fit bg-[#003366] hover:bg-[#002244] text-white font-medium py-2.5 px-6 rounded-xl text-sm shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={passAssist}
            disabled={classDetails.attendanceToken !== null || classDetails.expired || loading}
          >
            {loading ? "Iniciando..." : "Iniciar asistencia"}
          </button>
        </div>
      </div>
    </section>
  );
}
