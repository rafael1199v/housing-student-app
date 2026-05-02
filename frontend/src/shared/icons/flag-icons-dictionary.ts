import arFlag from "../../assets/icons/flags/ar.svg";
import boFlag from "../../assets/icons/flags/bo.svg";
import brFlag from "../../assets/icons/flags/br.svg";
import clFlag from "../../assets/icons/flags/cl.svg";
import coFlag from "../../assets/icons/flags/co.svg";
import crFlag from "../../assets/icons/flags/cr.svg";
import cuFlag from "../../assets/icons/flags/cu.svg";
import doFlag from "../../assets/icons/flags/do.svg";
import ecFlag from "../../assets/icons/flags/ec.svg";
import gtFlag from "../../assets/icons/flags/gt.svg";
import hnFlag from "../../assets/icons/flags/hn.svg";
import mxFlag from "../../assets/icons/flags/mx.svg";
import niFlag from "../../assets/icons/flags/ni.svg";
import paFlag from "../../assets/icons/flags/pa.svg";
import peFlag from "../../assets/icons/flags/pe.svg";
import prFlag from "../../assets/icons/flags/pr.svg";
import pyFlag from "../../assets/icons/flags/py.svg";
import svFlag from "../../assets/icons/flags/sv.svg";
import uyFlag from "../../assets/icons/flags/uy.svg";
import veFlag from "../../assets/icons/flags/ve.svg";

interface Flag {
	code: string;
	icon: string;
}

const FLAG_ICONS: Flag[] = [
	{ code: "AR", icon: arFlag },
	{ code: "BO", icon: boFlag },
	{ code: "BR", icon: brFlag },
	{ code: "CL", icon: clFlag },
	{ code: "CO", icon: coFlag },
	{ code: "CR", icon: crFlag },
	{ code: "CU", icon: cuFlag },
	{ code: "DO", icon: doFlag },
	{ code: "EC", icon: ecFlag },
	{ code: "SV", icon: svFlag },
	{ code: "GT", icon: gtFlag },
	{ code: "HN", icon: hnFlag },
	{ code: "MX", icon: mxFlag },
	{ code: "NI", icon: niFlag },
	{ code: "PA", icon: paFlag },
	{ code: "PY", icon: pyFlag },
	{ code: "PE", icon: peFlag },
	{ code: "PR", icon: prFlag },
	{ code: "UY", icon: uyFlag },
	{ code: "VE", icon: veFlag },
];

export { FLAG_ICONS };
export type { Flag };
