import { Outlet } from "react-router";

export function MainLayout() {
	return (
		<div className="">
			<div>Navbar</div>
			<Outlet />
		</div>
	);
}
