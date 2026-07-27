import { useFinishCourse } from "../../hooks/useFinishCourse";
import { toast } from "@pheralb/toast";

interface Props {
  redilId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function FinishCourseModal({ redilId, onClose, onSuccess }: Props) {
  const { finishCourse, loading } = useFinishCourse();

  const handleConfirm = async () => {
    const ok = await finishCourse(redilId);
    if (ok) {
      toast.success({ text: "Curso terminado. Estudiantes desactivados." });
      onSuccess();
      onClose();
    } else {
      toast.error({ text: "Error al terminar el curso. Intenta de nuevo." });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-xl">
        <h2 className="text-lg font-bold text-gray-900">Terminar curso</h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          ¿Estás seguro de que quieres terminar este curso?
        </p>
        <p className="mt-1 text-sm leading-relaxed text-gray-600">
          Todos los estudiantes serán <strong>desactivados</strong> y podrán inscribirse en otros
          cursos.
        </p>
        <p className="mt-4 rounded-xl border border-amber-100 bg-amber-50 p-3 text-sm font-medium text-amber-700">
          Esta acción no se puede deshacer.
        </p>
        <div className="mt-6 flex items-center gap-3">
          <button
            className="flex-1 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Terminando..." : "Sí, terminar curso"}
          </button>
        </div>
      </div>
    </div>
  );
}
