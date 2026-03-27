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
				<select
					value={extensionValue}
					onChange={(e) => onExtensionChange?.(e.target.value)}
					className="h-10 w-full rounded-md border border-outline-variant/25 bg-surface-container-high px-2 text-xl"
				>
					<option value="">Extensión</option>
					{LATIN_AMERICAN_COUNTRIES.map((country) => (
						<option key={country.code} value={country.extension}>
							{country.flag} {country.extension}
						</option>
					))}
				</select>
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
