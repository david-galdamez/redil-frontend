import { useRedilForm } from "../../hooks/useRedilForm";
import StudentsTab from "../student/StudentsTab";
import LinkCard from "../ui/LinkCard";
import RedilTabs from "./RedilTabs";
import TeachersTab from "./TeachersTab";

interface Props {
  id: string;
  redil: RedilDetailsDto;
}

enum Tabs {
  Teachers,
  Students,
}

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
        <h1 className="text-2xl font-bold text-[#003366] md:text-3xl">Detalles del redil</h1>
        <p className="mt-1 text-sm text-gray-500">
          Consulta y edita la información principal del redil.
        </p>
      </header>

      <div
        className={`space-y-5 rounded-2xl border bg-white p-6 shadow-sm ${editing ? "border-[#003366] ring-2 ring-blue-100/50" : "border-gray-100"}`}
      >
        {editing && (
          <div className="flex items-center gap-2 rounded-lg bg-blue-50/50 px-3 py-2 text-sm font-semibold text-[#003366]">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            {'Modo edición — los cambios se guardan al presionar "Guardar cambios"'}
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
          {errors.name && <p className="mt-1 text-xs font-medium text-red-600">{errors.name}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Número de curso</label>
          <input
            className={inputClass(editing)}
            type="number"
            name="numCourse"
            min={1}
            value={form.numCourse || ""}
            onChange={handleChange}
            disabled={!editing}
          />
          {errors.numCourse && (
            <p className="mt-1 text-xs font-medium text-red-600">{errors.numCourse}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Descripción</label>
          <textarea
            className={
              editing
                ? "min-h-[96px] w-full resize-y rounded-xl border-2 border-[#003366] bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-colors focus:outline-none"
                : "min-h-[96px] w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 transition-colors focus:border-[#003366] focus:bg-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-75"
            }
            name="description"
            value={form.description}
            onChange={handleChange}
            disabled={!editing}
          />
          {errors.description && (
            <p className="mt-1 text-xs font-medium text-red-600">{errors.description}</p>
          )}
        </div>

        <div className="pt-2">
          <LinkCard label="Link de registro:" link={redilLink} />
        </div>

        {errors.general && (
          <div className="rounded-xl border border-red-100 bg-red-50 p-3">
            <p className="text-center text-xs font-medium text-red-600">{errors.general}</p>
          </div>
        )}

        <div className="border-t border-gray-50 pt-4">
          <RedilTabs
            tabs={[
              { id: Tabs.Teachers, label: "Profesores" },
              { id: Tabs.Students, label: "Estudiantes" },
            ]}
            renderTab={(activeTab) => (
              <div className="mt-4">
                {activeTab === Tabs.Teachers && <TeachersTab teachers={redil.teacherList} />}
                {activeTab === Tabs.Students && <StudentsTab redilId={id} />}
              </div>
            )}
          />
        </div>

        <div className="flex flex-wrap gap-3 pt-4">
          {!editing ? (
            <button
              className="rounded-xl bg-[#003366] px-6 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#002244]"
              onClick={() => setEditing(true)}
            >
              Editar redil
            </button>
          ) : (
            <>
              <button
                className="rounded-xl bg-[#003366] px-6 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#002244] disabled:opacity-50"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Guardando..." : "Guardar cambios"}
              </button>
              <button
                className="rounded-xl border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
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
