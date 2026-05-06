import { useState, useRef } from "react";

interface Props {
    value: string;
    emails: string[];
    onChange: (value: string) => void;
    onSelect: (email: string) => void;
    error?: string;
}

export default function EmailAutocomplete({ value, emails, onChange, onSelect, error }: Props) {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [activeSuggestion, setActiveSuggestion] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);

    const getSuggestions = (input: string) => {
        if (!input) return [];
        const lower = input.toLowerCase();
        return emails.filter(e => e.toLowerCase().includes(lower)).slice(0, 5);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        onChange(val);
        setSuggestions(getSuggestions(val));
        setActiveSuggestion(-1);
    };

    const selectSuggestion = (email: string) => {
        onSelect(email);
        setSuggestions([]);
        setActiveSuggestion(-1);
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!suggestions.length) return;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveSuggestion(i => Math.min(i + 1, suggestions.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveSuggestion(i => Math.max(i - 1, 0));
        } else if (e.key === "Enter" && activeSuggestion >= 0) {
            e.preventDefault();
            selectSuggestion(suggestions[activeSuggestion]);
        } else if (e.key === "Escape") {
            setSuggestions([]);
        }
    };

    return (
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
                    value={value}
                    onChange={handleChange}
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
            {error && <p className="error-text">{error}</p>}
        </div>
    );
}