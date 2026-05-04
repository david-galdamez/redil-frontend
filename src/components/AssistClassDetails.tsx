import { toast } from "@pheralb/toast";
import type React from "react";
import { useState, useRef } from "react";
import { formatDateReadable } from "../lib/formatDate";

interface Props {
    apiUrl: string;
    assistClass: AssisClassDetailDto;
    attendanceToken: string;
    emails: string[];
}

export default function AssistClassDetails({ apiUrl, assistClass, attendanceToken, emails }: Props) {

    const [form, setForm] = useState({ email: "", attended: false });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ email: "", general: "" });
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [activeSuggestion, setActiveSuggestion] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);

    function getSuggestions(value: string): string[] {
        if (!value) return [];
        const lower = value.toLowerCase();
        return emails
            .filter((e) => e.toLowerCase().includes(lower))
            .slice(0, 5);
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setForm((prev) => ({ ...prev, email: value }));
        setSuggestions(getSuggestions(value));
        setActiveSuggestion(-1);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    function selectSuggestion(email: string) {
        setForm((prev) => ({ ...prev, email }));
        setSuggestions([]);
        setActiveSuggestion(-1);
        inputRef.current?.focus();
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (!suggestions.length) return;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveSuggestion((i) => Math.min(i + 1, suggestions.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveSuggestion((i) => Math.max(i - 1, 0));
        } else if (e.key === "Enter" && activeSuggestion >= 0) {
            e.preventDefault();
            selectSuggestion(suggestions[activeSuggestion]);
        } else if (e.key === "Escape") {
            setSuggestions([]);
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSuggestions([]);
        setLoading(true);
        try {
            const res = await fetch(`${apiUrl}/api/class/assist/register/${attendanceToken}`, {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = (await res.json()) as ApiResponse<string>;

            if (res.status === 400 && data.errors) {
                data.errors.forEach((err: Error) => {
                    if (err.field.toLowerCase() === "email") {
                        setErrors((prev) => ({ ...prev, email: err.message }));
                    }
                });
                return;
            }

            if (!res.ok || !data.success) {
                setErrors((prev) => ({ ...prev, general: data.message || "Ocurrió un error desconocido" }));
                return;
            }

            setErrors({ email: "", general: "" });
            setForm({ email: "", attended: false });
            toast.success({ text: data.message || "Asistencia registrada con exito" });
        } catch (e) {
            console.error("Error registering assist: ", e);
            toast.error({ text: "Ocurrio un error inesperado" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="page-shell">
            <header className="page-header">
                <h1 className="page-title">Asistencia - {assistClass.redilName}</h1>
                <p className="page-subtitle">{assistClass.classDescription}</p>
                <p className="text-sm text-slate-500">Clase dada: {formatDateReadable(assistClass.classDate)}</p>
            </header>

            <form className="form-card form-card-compact form-grid" onSubmit={handleSubmit}>
                <div className="field-group">
                    <label className="label-base" htmlFor="email">Correo del estudiante</label>
                    <div className="relative">
                        <input
                            ref={inputRef}
                            className="input-base w-full"
                            type="email"
                            name="email"
                            id="email"
                            required
                            autoComplete="off"
                            value={form.email}
                            onChange={handleEmailChange}
                            onKeyDown={handleKeyDown}
                            onBlur={() => setTimeout(() => setSuggestions([]), 150)}
                        />
                        {suggestions.length > 0 && (
                            <ul className="absolute z-50 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg overflow-hidden">
                                {suggestions.map((email, i) => (
                                    <li
                                        key={email}
                                        className={`px-3 py-2 text-sm cursor-pointer transition-colors ${i === activeSuggestion
                                                ? "bg-slate-100 text-slate-900"
                                                : "text-slate-700 hover:bg-slate-50"
                                            }`}
                                        onMouseDown={() => selectSuggestion(email)}
                                    >
                                        {email}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    {errors.email && <p className="error-text">{errors.email}</p>}
                </div>

                <label className="inline-flex items-center gap-3 text-sm text-slate-700" htmlFor="attended">
                    <input
                        className="checkbox-base"
                        type="checkbox"
                        name="attended"
                        id="attended"
                        checked={form.attended}
                        onChange={handleChange}
                    />
                    Asistio a la clase
                </label>

                {errors.general && <p className="error-text">{errors.general}</p>}

                <button className="btn-primary w-full sm:w-fit" type="submit" disabled={loading}>
                    {loading ? "Registrando asistencia..." : "Registrar asistencia"}
                </button>
            </form>
        </section>
    );
}