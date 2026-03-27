interface Country {
	code: string;
	name: string;
	flag: string;
	extension: string;
}

const LATIN_AMERICAN_COUNTRIES: Country[] = [
	{ code: "AR", name: "Argentina", flag: "🇦🇷", extension: "+54" },
	{ code: "BO", name: "Bolivia", flag: "🇧🇴", extension: "+591" },
	{ code: "BR", name: "Brasil", flag: "🇧🇷", extension: "+55" },
	{ code: "CL", name: "Chile", flag: "🇨🇱", extension: "+56" },
	{ code: "CO", name: "Colombia", flag: "🇨🇴", extension: "+57" },
	{ code: "CR", name: "Costa Rica", flag: "🇨🇷", extension: "+506" },
	{ code: "CU", name: "Cuba", flag: "🇨🇺", extension: "+53" },
	{ code: "DO", name: "República Dominicana", flag: "🇩🇴", extension: "+1-809" },
	{ code: "EC", name: "Ecuador", flag: "🇪🇨", extension: "+593" },
	{ code: "SV", name: "El Salvador", flag: "🇸🇻", extension: "+503" },
	{ code: "GT", name: "Guatemala", flag: "🇬🇹", extension: "+502" },
	{ code: "HN", name: "Honduras", flag: "🇭🇳", extension: "+504" },
	{ code: "MX", name: "México", flag: "🇲🇽", extension: "+52" },
	{ code: "NI", name: "Nicaragua", flag: "🇳🇮", extension: "+505" },
	{ code: "PA", name: "Panamá", flag: "🇵🇦", extension: "+507" },
	{ code: "PY", name: "Paraguay", flag: "🇵🇾", extension: "+595" },
	{ code: "PE", name: "Perú", flag: "🇵🇪", extension: "+51" },
	{ code: "PR", name: "Puerto Rico", flag: "🇵🇷", extension: "+1-787" },
	{ code: "UY", name: "Uruguay", flag: "🇺🇾", extension: "+598" },
	{ code: "VE", name: "Venezuela", flag: "🇻🇪", extension: "+58" },
];

export { LATIN_AMERICAN_COUNTRIES };
export type { Country };
