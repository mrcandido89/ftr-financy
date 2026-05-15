import { Header } from "./Header";

interface LayoutProps {
	children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
	return (
		<div className="min-h-screen bg-[#F8F9FA]">
			<Header />
			<main className="px-12 py-8">{children}</main>
		</div>
	);
}
