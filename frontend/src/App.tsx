import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router";

function App() {
	return (
		<QueryClientProvider client={new QueryClient()}>
			<Outlet />
		</QueryClientProvider>
	);
}

export default App;
