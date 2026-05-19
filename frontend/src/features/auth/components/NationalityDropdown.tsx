import { useEffect, useRef, useState } from "react";
import { LATIN_AMERICAN_COUNTRIES } from "./NationalitySelector";

interface NationalityDropdownProps {
	value: string;
	onChange: (code: string) => void;
	disabled?: boolean;
	ariaLabel?: string;
}

export function NationalityDropdown({
	value,
	onChange,
	disabled = false,
	ariaLabel = "Nationality selection",
}: NationalityDropdownProps) {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	const selected = LATIN_AMERICAN_COUNTRIES.find((c) => c.code === value);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div ref={ref} className="relative">
			<button
				type="button"
				disabled={disabled}
				onClick={() => !disabled && setOpen((prev) => !prev)}
				aria-haspopup="listbox"
				aria-expanded={open}
				aria-label={ariaLabel}
				className="field-filled w-full px-4 py-2.5 text-left flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
			>
				<div className="flex items-center gap-2 flex-1">
					{selected?.flagIcon ? (
						<img
							src={selected.flagIcon}
							alt={selected.code}
							className="w-5 h-5"
						/>
					) : (
						<div className="w-5 h-5" />
					)}
					<span>{selected?.name || "Seleccionar país"}</span>
				</div>
				<span className="text-slate-400 text-sm">▾</span>
			</button>

			{open && !disabled && (
				<div
					role="listbox"
					className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
				>
					{LATIN_AMERICAN_COUNTRIES.map((country) => (
						<button
							key={country.code}
							type="button"
							role="option"
							aria-selected={value === country.code}
							onClick={() => {
								onChange(country.code);
								setOpen(false);
							}}
							className={`w-full px-4 py-3 text-left flex items-center gap-3 transition ${
								value === country.code
									? "bg-primary/10 text-primary font-medium"
									: "text-slate-700 hover:bg-slate-50"
							}`}
						>
							<img
								src={country.flagIcon}
								alt={country.code}
								className="w-5 h-5"
							/>
							<span className="flex-1">{country.name}</span>
							<span className="text-xs text-slate-500 font-normal">
								{country.extension}
							</span>
						</button>
					))}
				</div>
			)}
		</div>
	);
}
