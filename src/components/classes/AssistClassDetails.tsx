import { formatDateReadable } from "../../lib/formatDate";
import { useAssistForm } from "../../hooks/useAssistForm";
import PhoneAutocomplete from "../ui/PhoneAutocomplete";

interface Props {
  assistClass: AssisClassDetailDto;
  attendanceToken: string;
  phones: string[];
}

export default function AssistClassDetails({ assistClass, attendanceToken, phones }: Props) {
  const { form, loading, errors, handleChange, handleSubmit, setPhone } =
    useAssistForm(attendanceToken);

  return (
    <section className="space-y-6">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-[#003366] md:text-3xl">
          Asistencia - {assistClass.redilName}
        </h1>
        <p className="mt-2 text-sm font-medium text-gray-700">{assistClass.classDescription}</p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-1.5">
          <i className="ti ti-calendar text-[#003366]"></i>
          <p className="text-xs font-bold text-[#003366]">
            Clase dada: {formatDateReadable(assistClass.classDate)}
          </p>
        </div>
      </header>

      <form
        className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
        onSubmit={handleSubmit}
      >
        <PhoneAutocomplete
          value={form.phone}
          phones={phones}
          onChange={(val) => setPhone(val)}
          onSelect={setPhone}
          error={errors.phone}
        />

        <div className="pt-2">
          <label
            className="inline-flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 transition-colors select-none hover:bg-gray-100"
            htmlFor="attended"
          >
            <input
              className="h-4 w-4 rounded border-gray-300 text-[#003366] focus:ring-[#003366]"
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
          <div className="rounded-xl border border-red-100 bg-red-50 p-3">
            <p className="text-center text-xs font-medium text-red-600">{errors.general}</p>
          </div>
        )}

        <div className="border-t border-gray-50 pt-2">
          <button
            className="w-full rounded-xl bg-[#003366] px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#002244] disabled:opacity-50 sm:w-fit"
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
