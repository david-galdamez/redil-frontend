import { formatDateReadable } from "../../lib/formatDate";
import { useAssistForm } from "../../hooks/useAssistForm";
import EmailAutocomplete from "../ui/EmailAutocomplete";

interface Props {
    apiUrl: string;
    assistClass: AssisClassDetailDto;
    attendanceToken: string;
    emails: string[];
}

export default function AssistClassDetails({ apiUrl, assistClass, attendanceToken, emails }: Props) {
    const { form, loading, errors, handleChange, handleSubmit, setEmail } =
        useAssistForm(apiUrl, attendanceToken);

    return (
        <section className="page-shell">
            <header className="page-header">
                <h1 className="page-title">Asistencia - {assistClass.redilName}</h1>
                <p className="page-subtitle">{assistClass.classDescription}</p>
                <p className="text-sm text-slate-500">
                    Clase dada: {formatDateReadable(assistClass.classDate)}
                </p>
            </header>

            <form className="form-card form-card-compact form-grid" onSubmit={handleSubmit}>
                <EmailAutocomplete
                    value={form.email}
                    emails={emails}
                    onChange={val => setEmail(val)}
                    onSelect={setEmail}
                    error={errors.email}
                />

                <label className="inline-flex items-center gap-3 text-sm text-slate-700" htmlFor="attended">
                    <input
                        className="checkbox-base"
                        type="checkbox"
                        name="attended"
                        id="attended"
                        checked={form.attended}
                        onChange={handleChange}
                    />
                    Asistió a la clase
                </label>

                {errors.general && <p className="error-text">{errors.general}</p>}

                <button className="btn-primary w-full sm:w-fit" type="submit" disabled={loading}>
                    {loading ? "Registrando asistencia..." : "Registrar asistencia"}
                </button>
            </form>
        </section>
    );
}