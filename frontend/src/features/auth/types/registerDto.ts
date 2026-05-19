import { RoleEnum } from "../../../global/enum/role";

export type RegisterDto = {
	email: string;
	password: string;
	role: RoleEnum;
	firstName: string;
	lastName: string;
	phoneNumber: string;
	nationality: string;
	gender: string;
	imageUrl: string;
	birthdate: string;
};
