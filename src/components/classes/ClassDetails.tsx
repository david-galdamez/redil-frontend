import { formatDateLocal } from "../../lib/formatDate";
import { usePassAssist } from "../../hooks/usePassAssist";
import AttendanceLinkCard from "./AttendanceLinkCard";
import RedilTabs from "../redil/RedilTabs";
import ManualAttendanceTab from "./ManualAttendanceTab";

interface Props {
  classDetails: ClassDetailsDto;
}

enum Tabs {
  Details,
  Manual,
}

const TAB_LIST = [
  { id: Tabs.Details, label: "Detalles" },
  { id: Tabs.Manual, label: "Asistencia manual" },
] as const;

export default function ClassDetails({ classDetails }: Props) {
  const { passAssist, loading } = usePassAssist(classDetails.classId);
  const assistLink = classDetails.attendanceToken
    ? `${window.location.origin}/assist/${classDetails.attendanceToken}`
    : null;
  const hasAttendance = !!classDetails.attendanceToken;

  const detailsContent = (
    <div className="space-y-5">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-700" htmlFor="description">
          Descripción de la clase
        </label>
        <textarea
          className="min-h-[96px] w-full cursor-not-allowed resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 opacity-90"
          name="description"
          id="description"
          defaultValue={classDetails.classDescription}
          disabled
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-700" htmlFor="date">
          Fecha de la clase
        </label>
        <input
          className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 opacity-90"
          type="datetime-local"
          name="date"
          id="date"
          defaultValue={formatDateLocal(classDetails.classDate)}
          disabled
        />
      </div>

      {assistLink && (
        <div className="pt-2">
          <AttendanceLinkCard assistLink={assistLink} expired={classDetails.expired} />
        </div>
      )}

      <div className="border-t border-gray-50 pt-4">
        <button
          className="w-full rounded-xl bg-[#003366] px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#002244] disabled:cursor-not-allowed disabled:opacity-50 sm:w-fit"
          onClick={passAssist}
          disabled={classDetails.attendanceToken !== null || classDetails.expired || loading}
        >
          {loading ? "Iniciando..." : "Iniciar asistencia"}
        </button>
      </div>
    </div>
  );

  return (
    <section className="space-y-6">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-[#003366] md:text-3xl">Detalles de clase</h1>
        <p className="mt-1 text-sm text-gray-500">Información general y control de asistencia.</p>
      </header>

      {hasAttendance ? (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="px-6 pt-4">
            <RedilTabs
              tabs={TAB_LIST}
              renderTab={(activeTab) => (
                <div className="pb-6">
                  {activeTab === Tabs.Details && detailsContent}
                  {activeTab === Tabs.Manual && (
                    <ManualAttendanceTab
                      redilId={String(classDetails.redilId)}
                      attendanceToken={classDetails.attendanceToken!}
                    />
                  )}
                </div>
              )}
            />
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          {detailsContent}
        </div>
      )}
    </section>
  );
}
