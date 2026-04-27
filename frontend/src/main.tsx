import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./i18n";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { RouterProvider } from "react-router";
import { GOOGLE_CLIENT_ID } from "./config/constants.ts";
import { router } from "./routers/routes.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
			<RouterProvider router={router} />
		</GoogleOAuthProvider>
	</StrictMode>,
);
