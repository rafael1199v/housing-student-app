import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import roomService from "../../../services/roomService";
import { RoomWizard } from "../../new-room/components/RoomWizard";
import { mapDetailToEditData } from "../utils/mapDetailToEditData";

export function EditRoomPage() {
	const { t } = useTranslation();
	const { id } = useParams<{ id: string }>();
	const queryClient = useQueryClient();

	const {
		data: room,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["owner-room", id],
		queryFn: () => roomService.getHouseholderRoomDetail(id!),
		enabled: !!id,
	});

	const initialData = useMemo(
		() => (room ? mapDetailToEditData(room) : undefined),
		[room],
	);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-24 text-slate-500 text-sm">
				{t("ownerRoomDetails.loading")}
			</div>
		);
	}

	if (isError || !room || !id || !initialData) {
		return (
			<div className="rounded-xl bg-surface-container-lowest p-6 text-sm text-tertiary shadow-sm">
				{t("ownerRoomDetails.loadError")}
			</div>
		);
	}

	return (
		<RoomWizard
			mode="edit"
			roomId={id}
			initialData={initialData}
			onSaved={() =>
				queryClient.invalidateQueries({ queryKey: ["owner-room", id] })
			}
		/>
	);
}
