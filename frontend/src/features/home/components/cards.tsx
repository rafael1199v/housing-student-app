interface CardProps {
	name: string;
	price: number;
	description: string;
}

export function Card({ name, price, description }: CardProps) {
	return (
		<div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
			{/* <img className="" src={data.imageUrl}/> */}
			<p>{name}</p>
			<p>{price}</p>
			<p>{description}</p>
		</div>
	);
}
