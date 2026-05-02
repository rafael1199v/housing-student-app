import { forwardRef } from "react";
import { LATIN_AMERICAN_COUNTRIES } from "./NationalitySelector";

interface PhoneInputProps {
	extensionValue?: string;
	phoneValue?: string;
	onExtensionChange?: (value: string) => void;
}

const PhoneInput = forwardRef<
	HTMLDivElement,
	PhoneInputProps & React.HTMLAttributes<HTMLDivElement>
>(({ extensionValue = "", phoneValue = "", onExtensionChange }, ref) => {
	return (
		<div ref={ref} className="flex gap-3">
			{/* Extension Selector */}
			<div className="shrink-0 w-32">
				<div className="relative h-10 rounded-md border border-outline-variant/25 bg-surface-container-high overflow-hidden">
					<select
						value={extensionValue}
						onChange={(e) => onExtensionChange?.(e.target.value)}
						className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
					>
						<option value="">Extensión</option>
						{LATIN_AMERICAN_COUNTRIES.map((country) => (
							<option key={country.code} value={country.extension}>
								{country.code} {country.extension}
							</option>
						))}
					</select>
					<div className="flex items-center gap-1.5 px-2 h-full pointer-events-none text-sm">
						{extensionValue ? (
							<>
								{LATIN_AMERICAN_COUNTRIES.find(
									(c) => c.extension === extensionValue,
								)?.flagIcon ? (
									<img
										src={
											LATIN_AMERICAN_COUNTRIES.find(
												(c) => c.extension === extensionValue,
											)!.flagIcon
										}
										alt=""
										className="w-4 h-4"
									/>
								) : null}
								<span className="text-slate-700">{extensionValue}</span>
							</>
						) : (
							<span className="text-slate-500">Extensión</span>
						)}
					</div>
				</div>
			</div>

			{/* Phone Number Input */}
			<input
				type="tel"
				placeholder="Teléfono"
				value={phoneValue}
				className="h-10 flex-1 rounded-md border border-outline-variant/25 bg-surface-container-high px-3 text-xl"
			/>
		</div>
	);
});

PhoneInput.displayName = "PhoneInput";

export default PhoneInput;
