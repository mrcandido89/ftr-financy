import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ApolloProvider } from "@apollo/client/react";
import App from "./App.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
import { ThemeProvider } from "./hooks/use-theme.tsx";
import { client } from "./lib/graphql/apollo";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ApolloProvider client={client}>
			<ThemeProvider defaultTheme="light" storageKey="financy-theme">
				<App />
				<Toaster />
			</ThemeProvider>
		</ApolloProvider>
	</StrictMode>,
);
