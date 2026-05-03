import { z } from "zod";
import i18n from "../../../i18n";

const v = (key: string) => i18n.t(key, { ns: "validation" });

export const createRoomSchema = z.object({
	name: z.string().trim().min(1, v("room.nameRequired")),
	description: z
		.string()
		.trim()
		.min(1, v("room.descriptionRequired"))
		.max(300, v("room.descriptionTooLong")),
	price: z.coerce
		.number({ error: v("room.priceRequired") })
		.positive(v("room.priceTooLow"))
		.max(99999, v("room.priceTooHigh")),
	roomStatus: z.coerce.number().int().min(1).max(3),
	latitude: z
		.number({ error: v("room.locationRequired") })
		.min(-90, v("room.latitudeRange"))
		.max(90, v("room.latitudeRange")),
	longitude: z
		.number({ error: v("room.locationRequired") })
		.min(-180, v("room.longitudeRange"))
		.max(180, v("room.longitudeRange")),
});

export type CreateRoomFormValues = z.input<typeof createRoomSchema>;
export type CreateRoomFormOutput = z.output<typeof createRoomSchema>;
