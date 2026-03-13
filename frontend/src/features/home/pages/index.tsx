import { useQuery } from "@tanstack/react-query";
import roomService from "../../../services/roomService";
import { Card } from "../components/cards";
import { CardSkeleton } from "../components/skeleton";

export function HomePage() {
	const { isLoading, isError, data } = useQuery({
		queryKey: ["rooms"],
		queryFn: roomService.getRooms,
	});

	if (isError) {
		return <div>Error</div>;
	}

	return (
		<div className="w-full h-full">
			<h1>Bienvenido</h1>
			<p>
				Esta es una página de búsqueda de alojamiento, dedicado especialmente a
				estudiantes.
			</p>
			{isLoading ? (
				<CardSkeleton quantity={3} />
			) : isError ? (
				<div>Error</div>
			) : (
				data?.map((room) => (
					<Card
						name={room.name}
						price={room.price}
						description={room.description}
					/>
				))
			)}
		</div>
	);
}
