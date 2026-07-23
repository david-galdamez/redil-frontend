import { useRedilForm } from "../../hooks/useRedilForm";
import StudentsTab from "../student/StudentsTab";
import LinkCard from "../ui/LinkCard";
import RedilTabs from "./RedilTabs";
import TeachersTab from "./TeachersTab";

interface Props {
  id: string;
  redil: RedilDetailsDto;
}

enum Tabs { Teachers, Students }

function inputClass(editing: boolean) {
  return editing
    ? "w-full px-4 py-2.5 bg-white border-2 border-[#003366] rounded-xl text-sm focus:outline-none transition-colors text-gray-800 shadow-sm"
    : "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#003366] focus:bg-white transition-colors text-gray-800 disabled:opacity-75 disabled:cursor-not-allowed";
}

export default function RedilDetails({ id, redil }: Props) {
  const { editing, setEditing, form, errors, loading, handleChange, handleCancel, handleSubmit } =
    useRedilForm(id, redil);

  const redilLink = `${window.location.origin}/redil/student/${redil.redilCode}`;

  return (
    <section className="space-y-6">
      <header className="mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-[#003366]">Detalles del redil</h1>
        <p className="text-sm text-gray-500 mt-1">Consulta y edita la información principal del redil.</p>
      </header>

      <div className={`bg-white rounded-2xl p-6 shadow-sm border space-y-5 ${editing ? "border-[#003366] ring-2 ring-blue-100/50" : "border-gray-100"}`}>
        {editing && (
          <div className="flex items-center gap-2 text-sm font-semibold text-[#003366] bg-blue-50/50 px-3 py-2 rounded-lg">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            Modo edición — los cambios se guardan al presionar "Guardar cambios"
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Nombre</label>
          <input
            className={inputClass(editing)}
            name="name"
            value={form.name}
            onChange={handleChange}
            disabled={!editing}
          />
          {errors.name && <p className="text-xs font-medium text-red-600 mt-1">{errors.name}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Descripción</label>
          <textarea
            className={editing ? "w-full px-4 py-2.5 bg-white border-2 border-[#003366] rounded-xl text-sm focus:outline-none transition-colors text-gray-800 min-h-[96px] resize-y shadow-sm" : "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#003366] focus:bg-white transition-colors text-gray-800 min-h-[96px] resize-y disabled:opacity-75 disabled:cursor-not-allowed"}
            name="description"
            value={form.description}
            onChange={handleChange}
            disabled={!editing}
          />
          {errors.description && <p className="text-xs font-medium text-red-600 mt-1">{errors.description}</p>}
        </div>

        <div className="pt-2">
          <LinkCard label="Link de registro:" link={redilLink} />
        </div>

        {errors.general && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
            <p className="text-xs font-medium text-red-600 text-center">{errors.general}</p>
          </div>
        )}

        <div className="pt-4 border-t border-gray-50">
          <RedilTabs
            tabs={[
              { id: Tabs.Teachers, label: "Profesores" },
              { id: Tabs.Students, label: "Estudiantes" },
            ]}
            renderTab={activeTab => (
              <div className="mt-4">
                {activeTab === Tabs.Teachers && <TeachersTab teachers={redil.teacherList} />}
                {activeTab === Tabs.Students && <StudentsTab redilId={id} />}
              </div>
            )}
          />
        </div>

        <div className="pt-4 flex flex-wrap gap-3">
          {!editing ? (
            <button
              className="bg-[#003366] hover:bg-[#002244] text-white font-medium py-2 px-6 rounded-xl text-sm shadow-sm transition-colors"
              onClick={() => setEditing(true)}
            >
              Editar redil
            </button>
          ) : (
            <>
              <button
                className="bg-[#003366] hover:bg-[#002244] text-white font-medium py-2 px-6 rounded-xl text-sm shadow-sm transition-colors disabled:opacity-50"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Guardando..." : "Guardar cambios"}
              </button>
              <button
                className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 font-medium py-2 px-5 rounded-xl text-sm transition-colors"
                onClick={handleCancel}
              >
                Cancelar
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
