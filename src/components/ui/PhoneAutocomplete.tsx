import { useState, useRef } from "react";

interface Props {
  value: string;
  phones: string[];
  onChange: (value: string) => void;
  onSelect: (phone: string) => void;
  error?: string;
}

export default function PhoneAutocomplete({ value, phones, onChange, onSelect, error }: Props) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const getSuggestions = (input: string) => {
    if (!input) return [];
    return phones.filter((p) => p.includes(input)).slice(0, 5);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);
    setSuggestions(getSuggestions(val));
    setActiveSuggestion(-1);
  };

  const selectSuggestion = (phone: string) => {
    onSelect(phone);
    setSuggestions([]);
    setActiveSuggestion(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestion((i) => Math.min(suggestions.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestion((i) => Math.max(0, i - 1));
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
    <div className="flex w-full flex-col gap-1.5">
      <label className="text-sm font-semibold text-gray-700" htmlFor="phone">
        Teléfono
      </label>
      <div className="relative w-full">
        <input
          ref={inputRef}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 transition-colors focus:border-[#003366] focus:bg-white focus:outline-none"
          type="tel"
          name="phone"
          id="phone"
          required
          autoComplete="off"
          placeholder="Ej. 76543210"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={() => setTimeout(() => setSuggestions([]), 150)}
        />
        {suggestions.length > 0 && (
          <ul className="absolute z-50 mt-1.5 w-full divide-y divide-gray-50 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
            {suggestions.map((phone, i) => (
              <li
                key={phone}
                className={`cursor-pointer px-4 py-2.5 text-sm transition-colors ${
                  i === activeSuggestion
                    ? "bg-blue-50 font-medium text-[#003366]"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onMouseDown={() => selectSuggestion(phone)}
              >
                {phone}
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
