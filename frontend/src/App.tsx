import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Categories } from "./pages/Categories";
import { Dashboard } from "./pages/Dashboard";
import { Login } from "./pages/Login";
import { Profile } from "./pages/Profile";
import { Signup } from "./pages/Signup";
import { Transactions } from "./pages/Transactions";
import { useAuthStore } from "./stores/auth";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

	if (isAuthenticated) {
		return <Navigate to="/" replace />;
	}

	return <>{children}</>;
}

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path="/login"
					element={
						<PublicRoute>
							<Login />
						</PublicRoute>
					}
				/>
				<Route
					path="/signup"
					element={
						<PublicRoute>
							<Signup />
						</PublicRoute>
					}
				/>
				<Route
					path="/"
					element={
						<ProtectedRoute>
							<Dashboard />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/transactions"
					element={
						<ProtectedRoute>
							<Transactions />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/categories"
					element={
						<ProtectedRoute>
							<Categories />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/profile"
					element={
						<ProtectedRoute>
							<Profile />
						</ProtectedRoute>
					}
				/>
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
