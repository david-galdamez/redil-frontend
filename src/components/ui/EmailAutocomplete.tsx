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
            setActiveSuggestion(i => Math.min(suggestions.length - 1, i + 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveSuggestion(i => Math.max(0, i - 1));
        } else if (e.key === "Enter") {
            if (activeSuggestion >= 0) {
                e.preventDefault();
                selectSuggestion(suggestions[activeSuggestion]);
            }
        } else if (e.key === "Escape") {
            setSuggestions([]);
            setActiveSuggestion(-1);
        }
    };

    return (
        <div className="flex flex-col gap-1.5 w-full">
            <div className="relative w-full">
                <input
                    ref={inputRef}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#003366] focus:bg-white transition-colors text-gray-800"
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
                    <ul className="absolute z-50 mt-1.5 w-full rounded-xl border border-gray-100 bg-white shadow-lg overflow-hidden divide-y divide-gray-50">
                        {suggestions.map((email, i) => (
                            <li
                                key={email}
                                className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${i === activeSuggestion
                                        ? "bg-blue-50 text-[#003366] font-medium"
                                        : "text-gray-700 hover:bg-gray-50"
                                    }`}
                                onMouseDown={() => selectSuggestion(email)}
                            >
                                {email}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {error && <p className="text-xs font-medium text-red-600 mt-1">{error}</p>}
        </div>
    );
}