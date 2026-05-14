import { RoleEnum } from "../../../global/enum/role";

export interface RegisterGoogleRequest {
	idToken: string;
	role: RoleEnum;
}
