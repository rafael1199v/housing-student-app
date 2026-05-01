interface Flag {
	code: string;
	icon: string;
}

// TODO: Usar un mejor enrutamiento "@" en vez de relativo "../../assets"
const FLAG_ICONS: Flag[] = [
	{ code: "AR", icon: "../../assets/icons/flags/ar.svg" },
	{ code: "BO", icon: "../../assets/icons/flags/bo.svg" },
	{ code: "BR", icon: "../../assets/icons/flags/br.svg" },
	{ code: "CL", icon: "../../assets/icons/flags/cl.svg" },
	{ code: "CO", icon: "../../assets/icons/flags/co.svg" },
	{ code: "CR", icon: "../../assets/icons/flags/cr.svg" },
	{ code: "CU", icon: "../../assets/icons/flags/cu.svg" },
	{ code: "DO", icon: "../../assets/icons/flags/do.svg" },
	{ code: "EC", icon: "../../assets/icons/flags/ec.svg" },
	{ code: "SV", icon: "../../assets/icons/flags/sv.svg" },
	{ code: "GT", icon: "../../assets/icons/flags/gt.svg" },
	{ code: "HN", icon: "../../assets/icons/flags/hn.svg" },
	{ code: "MX", icon: "../../assets/icons/flags/mx.svg" },
	{ code: "NI", icon: "../../assets/icons/flags/ni.svg" },
	{ code: "PA", icon: "../../assets/icons/flags/pa.svg" },
	{ code: "PY", icon: "../../assets/icons/flags/py.svg" },
	{ code: "PE", icon: "../../assets/icons/flags/pe.svg" },
	{ code: "PR", icon: "../../assets/icons/flags/pr.svg" },
	{ code: "UY", icon: "../../assets/icons/flags/uy.svg" },
	{ code: "VE", icon: "../../assets/icons/flags/ve.svg" },
];

export { FLAG_ICONS };
export type { Flag };
