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
      <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 w-full max-w-md mx-4">
        <h2 className="text-lg font-bold text-gray-900">Terminar curso</h2>
        <p className="text-sm text-gray-600 mt-3 leading-relaxed">
          ¿Estás seguro de que quieres terminar este curso?
        </p>
        <p className="text-sm text-gray-600 mt-1 leading-relaxed">
          Todos los estudiantes serán <strong>desactivados</strong> y podrán inscribirse en otros cursos.
        </p>
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-xl p-3 mt-4 font-medium">
          Esta acción no se puede deshacer.
        </p>
        <div className="flex items-center gap-3 mt-6">
          <button
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 px-4 rounded-xl text-sm transition-colors"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-4 rounded-xl text-sm shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
