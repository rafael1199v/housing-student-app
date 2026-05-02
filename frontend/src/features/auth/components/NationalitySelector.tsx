import { FLAG_ICONS } from "../../../shared/icons/flag-icons-dictionary";

interface Country {
	code: string;
	name: string;
	flagIcon: string;
	extension: string;
}

// Build flag lookup map
const flagMap = new Map(FLAG_ICONS.map((f) => [f.code, f.icon]));

const LATIN_AMERICAN_COUNTRIES: Country[] = [
	{
		code: "AR",
		name: "Argentina",
		flagIcon: flagMap.get("AR") || "",
		extension: "+54",
	},
	{
		code: "BO",
		name: "Bolivia",
		flagIcon: flagMap.get("BO") || "",
		extension: "+591",
	},
	{
		code: "BR",
		name: "Brasil",
		flagIcon: flagMap.get("BR") || "",
		extension: "+55",
	},
	{
		code: "CL",
		name: "Chile",
		flagIcon: flagMap.get("CL") || "",
		extension: "+56",
	},
	{
		code: "CO",
		name: "Colombia",
		flagIcon: flagMap.get("CO") || "",
		extension: "+57",
	},
	{
		code: "CR",
		name: "Costa Rica",
		flagIcon: flagMap.get("CR") || "",
		extension: "+506",
	},
	{
		code: "CU",
		name: "Cuba",
		flagIcon: flagMap.get("CU") || "",
		extension: "+53",
	},
	{
		code: "DO",
		name: "República Dominicana",
		flagIcon: flagMap.get("DO") || "",
		extension: "+1-809",
	},
	{
		code: "EC",
		name: "Ecuador",
		flagIcon: flagMap.get("EC") || "",
		extension: "+593",
	},
	{
		code: "SV",
		name: "El Salvador",
		flagIcon: flagMap.get("SV") || "",
		extension: "+503",
	},
	{
		code: "GT",
		name: "Guatemala",
		flagIcon: flagMap.get("GT") || "",
		extension: "+502",
	},
	{
		code: "HN",
		name: "Honduras",
		flagIcon: flagMap.get("HN") || "",
		extension: "+504",
	},
	{
		code: "MX",
		name: "México",
		flagIcon: flagMap.get("MX") || "",
		extension: "+52",
	},
	{
		code: "NI",
		name: "Nicaragua",
		flagIcon: flagMap.get("NI") || "",
		extension: "+505",
	},
	{
		code: "PA",
		name: "Panamá",
		flagIcon: flagMap.get("PA") || "",
		extension: "+507",
	},
	{
		code: "PY",
		name: "Paraguay",
		flagIcon: flagMap.get("PY") || "",
		extension: "+595",
	},
	{
		code: "PE",
		name: "Perú",
		flagIcon: flagMap.get("PE") || "",
		extension: "+51",
	},
	{
		code: "PR",
		name: "Puerto Rico",
		flagIcon: flagMap.get("PR") || "",
		extension: "+1-787",
	},
	{
		code: "UY",
		name: "Uruguay",
		flagIcon: flagMap.get("UY") || "",
		extension: "+598",
	},
	{
		code: "VE",
		name: "Venezuela",
		flagIcon: flagMap.get("VE") || "",
		extension: "+58",
	},
];

export { LATIN_AMERICAN_COUNTRIES };
export type { Country };
