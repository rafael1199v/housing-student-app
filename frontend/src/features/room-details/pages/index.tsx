import { useState } from "react";

export interface Room {
	id: string;
	name: string;
	latitude: number;
	longitude: number;
	description: string;
	price: number;
	personId: string;
	roomStatus: string;
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	imageUrls: Array<string>;
}

// Mock data - Replace with actual API call using useQuery
const mockRoomData: Room = {
	id: "1",
	name: "Hermosa Habitación Céntrica",
	latitude: 40.4168,
	longitude: -3.7038,
	description:
		"Espaciosa habitación completamente amueblada con acceso a sala común, cocina compartida y baño privado. Ubicada en zona céntrica con fácil acceso al transporte público.",
	price: 2500,
	personId: "119f044e-4651-4e1f-b54d-d95f9f0fe426",
	roomStatus: "1",
	firstName: "Juan",
	lastName: "Peres",
	email: "juan.perez@example16.com",
	phoneNumber: "+541122334455",
	imageUrls: [
		"https://images.unsplash.com/photo-1540932239986-310128078ceb?w=800&h=600&fit=crop",
		"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
		"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
	],
};

export function RoomDetails() {
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);
	const room = mockRoomData;

	const nextImage = () => {
		setSelectedImageIndex((prev) => (prev + 1) % room.imageUrls.length);
	};

	const prevImage = () => {
		setSelectedImageIndex(
			(prev) => (prev - 1 + room.imageUrls.length) % room.imageUrls.length,
		);
	};

	const formattedPrice = new Intl.NumberFormat("es-BO", {
		style: "currency",
		currency: "BOB",
	}).format(room.price);

	return (
		<div className="space-y-8">
			<section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
				<div className="relative bg-slate-100">
					<img
						src={room.imageUrls[selectedImageIndex]}
						alt={`${room.name} - Image ${selectedImageIndex + 1}`}
						className="w-full h-96 object-cover"
					/>

					{room.imageUrls.length > 1 && (
						<>
							<button
								onClick={prevImage}
								className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
								aria-label="Imagen anterior"
							>
								<svg
									className="w-6 h-6"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M15 19l-7-7 7-7"
									/>
								</svg>
							</button>

							<button
								onClick={nextImage}
								className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
								aria-label="Siguiente imagen"
							>
								<svg
									className="w-6 h-6"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 5l7 7-7 7"
									/>
								</svg>
							</button>

							<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
								{room.imageUrls.map((_, index) => (
									<button
										key={index}
										onClick={() => setSelectedImageIndex(index)}
										className={`w-3 h-3 rounded-full transition-all ${
											index === selectedImageIndex
												? "bg-white w-8"
												: "bg-white/60 hover:bg-white/80"
										}`}
										aria-label={`Ver imagen ${index + 1}`}
									/>
								))}
							</div>
						</>
					)}
				</div>

				<div className="p-8 space-y-6">
					<div className="space-y-3">
						<h1 className="text-4xl font-bold text-slate-900">{room.name}</h1>
						<div className="inline-block bg-gradient-to from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-lg">
							{formattedPrice}/mes
						</div>
					</div>

					<div className="space-y-2">
						<h2 className="text-lg font-semibold text-slate-900">
							Descripción
						</h2>
						<p className="text-slate-600 leading-relaxed">{room.description}</p>
					</div>

					<div className="border-t border-slate-200 pt-6">
						<div className="flex items-center gap-4">
							<div className="w-14 h-14"></div>
							<div>
								<p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
									Dueño de la propiedad
								</p>
								<p className="text-lg font-semibold text-slate-900">
									{room.firstName + " " + room.lastName}
								</p>
							</div>
						</div>
					</div>

					<div className="border-t border-slate-200 pt-6 flex gap-3">
						<button
							className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
							onClick={() => {
								console.log(room.phoneNumber, room.email);
							}}
						>
							Contactar propietario
						</button>
					</div>
				</div>
			</section>
		</div>
	);
}
