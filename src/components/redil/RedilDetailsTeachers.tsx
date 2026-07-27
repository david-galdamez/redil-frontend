import { useState } from "react";
import LinkCard from "../ui/LinkCard";
import RedilTabs from "./RedilTabs";
import StudentsTab from "../student/StudentsTab";
import TeacherStats from "../stats/TeacherStats";
import FinishCourseModal from "./FinishCourseModal";

interface Props {
  id: string;
  redil: RedilDetailsDto;
}

enum Tabs {
  Students,
  Stats,
}

const TAB_LIST = [
  { id: Tabs.Students, label: "Estudiantes" },
  { id: Tabs.Stats, label: "Estadísticas" },
] as const;

export default function RedilDetailsTeacher({ id, redil }: Props) {
  const [showFinishModal, setShowFinishModal] = useState(false);
  const redilLink = `${window.location.origin}/redil/student/${redil.redilCode}`;

  return (
    <section className="space-y-6">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-[#003366] md:text-3xl">Detalles del redil</h1>
        <p className="mt-1 text-sm text-gray-500">Gestión de tu redil asignado.</p>
      </header>

      <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Nombre</label>
          <input
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 disabled:cursor-not-allowed disabled:opacity-75"
            value={redil.name}
            disabled
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Número de curso</label>
          <input
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 disabled:cursor-not-allowed disabled:opacity-75"
            value={redil.numCourse}
            disabled
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Descripción</label>
          <textarea
            className="min-h-[96px] w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 disabled:cursor-not-allowed disabled:opacity-75"
            value={redil.description}
            disabled
          />
        </div>

        <div className="pt-2">
          <LinkCard label="Link de asistencia:" link={redilLink} />
        </div>

        <div className="border-t border-gray-50 pt-4">
          <RedilTabs
            tabs={TAB_LIST}
            renderTab={(activeTab) => (
              <div className="mt-4">
                {activeTab === Tabs.Stats && <TeacherStats redilId={id} />}
                {activeTab === Tabs.Students && <StudentsTab redilId={id} />}
              </div>
            )}
          />
        </div>
      </div>
      <div className="flex justify-end border-t border-gray-100 pt-6">
        <button
          onClick={() => setShowFinishModal(true)}
          className="w-full rounded-xl bg-red-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 sm:w-fit"
        >
          Terminar curso
        </button>
      </div>

      {showFinishModal && (
        <FinishCourseModal
          redilId={id}
          onClose={() => setShowFinishModal(false)}
          onSuccess={() => window.location.reload()}
        />
      )}
    </section>
  );
}
