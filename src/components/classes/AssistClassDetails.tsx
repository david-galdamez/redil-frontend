import { formatDateReadable } from "../../lib/formatDate";
import { useAssistForm } from "../../hooks/useAssistForm";
import EmailAutocomplete from "../ui/EmailAutocomplete";

interface Props {
  assistClass: AssisClassDetailDto;
  attendanceToken: string;
  emails: string[];
}

export default function AssistClassDetails({ assistClass, attendanceToken, emails }: Props) {
  const { form, loading, errors, handleChange, handleSubmit, setEmail } =
    useAssistForm(attendanceToken);

  return (
    <section className="space-y-6">
      <header className="mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-[#003366]">Asistencia - {assistClass.redilName}</h1>
        <p className="text-sm text-gray-700 mt-2 font-medium">{assistClass.classDescription}</p>
        <div className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg">
          <i className="ti ti-calendar text-[#003366]"></i>
          <p className="text-xs font-bold text-[#003366]">
            Clase dada: {formatDateReadable(assistClass.classDate)}
          </p>
        </div>
      </header>

      <form className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5" onSubmit={handleSubmit}>

        <EmailAutocomplete
          value={form.email}
          emails={emails}
          onChange={val => setEmail(val)}
          onSelect={setEmail}
          error={errors.email}
        />

        <div className="pt-2">
          <label className="inline-flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors select-none" htmlFor="attended">
            <input
              className="w-4 h-4 rounded border-gray-300 text-[#003366] focus:ring-[#003366]"
              type="checkbox"
              name="attended"
              id="attended"
              checked={form.attended}
              onChange={handleChange}
            />
            Confirmo mi asistencia a la clase
          </label>
        </div>

        {errors.general && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
            <p className="text-xs font-medium text-red-600 text-center">{errors.general}</p>
          </div>
        )}

        <div className="pt-2 border-t border-gray-50">
          <button
            className="w-full sm:w-fit bg-[#003366] hover:bg-[#002244] text-white font-medium py-2.5 px-6 rounded-xl text-sm shadow-sm transition-colors disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            {loading ? "Registrando asistencia..." : "Registrar asistencia"}
          </button>
        </div>
      </form>
    </section>
  );
}
