import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router";
import { Toaster } from "sonner";

function App() {
	return (
		<QueryClientProvider client={new QueryClient()}>
			<Toaster position="top-center" duration={3000}/>
			<Outlet />
		</QueryClientProvider>
	);
}

export default App;
