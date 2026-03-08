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
			<div className="flex-shrink-0 w-32">
				<select
					value={extensionValue}
					onChange={(e) => onExtensionChange?.(e.target.value)}
					className="rounded-md bg-gray-300 h-10 text-xl px-2 w-full"
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
				className="rounded-md bg-gray-300 h-10 text-xl px-3 flex-1"
			/>
		</div>
	);
});

PhoneInput.displayName = "PhoneInput";

export default PhoneInput;
