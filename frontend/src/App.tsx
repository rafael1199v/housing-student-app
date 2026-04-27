import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { APIProvider } from "@vis.gl/react-google-maps";
import { Outlet } from "react-router";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

function App() {
	return (
		<APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
			<QueryClientProvider client={queryClient}>
				<Toaster position="top-center" duration={3000} />
				<Outlet />
			</QueryClientProvider>
		</APIProvider>
	);
}

export default App;
