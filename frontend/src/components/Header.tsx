import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";
import { useAuthStore } from "../stores/auth";
import { Avatar, AvatarFallback } from "./ui/avatar";

export function Header() {
	const { user } = useAuthStore();
	const location = useLocation();

	if (!user) return null;

	const initials = user.name?.charAt(0)?.toUpperCase() || "U";

	return (
		<header className="border-b border-[#E5E7EB] bg-white">
			<div className="px-12 h-[73px] flex items-center justify-between">
				<Link to="/" className="flex items-center gap-3">
					<div className="size-10 rounded-full bg-[#1F6F43] flex items-center justify-center">
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" />
							<path
								d="M2 17L12 22L22 17"
								stroke="white"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M2 12L12 17L22 12"
								stroke="white"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</div>
					<span className="text-2xl font-bold text-[#1F6F43]">FINANCY</span>
				</Link>

				<nav className="absolute left-1/2 transform -translate-x-1/2 flex gap-8">
					<Link
						to="/"
						className={cn(
							"text-sm font-medium transition-colors",
							location.pathname === "/"
								? "text-[#1F6F43]"
								: "text-[#6B7280] hover:text-[#1F6F43]",
						)}
					>
						Dashboard
					</Link>
					<Link
						to="/transactions"
						className={cn(
							"text-sm font-medium transition-colors",
							location.pathname === "/transactions"
								? "text-[#1F6F43]"
								: "text-[#6B7280] hover:text-[#1F6F43]",
						)}
					>
						Transações
					</Link>
					<Link
						to="/categories"
						className={cn(
							"text-sm font-medium transition-colors",
							location.pathname === "/categories"
								? "text-[#1F6F43]"
								: "text-[#6B7280] hover:text-[#1F6F43]",
						)}
					>
						Categorias
					</Link>
				</nav>

				<Link to="/profile">
					<Avatar className="cursor-pointer hover:opacity-80 transition-opacity size-10">
						<AvatarFallback className="bg-[#E5E7Eb] text-[#6B7280] text-sm font-semibold">
							{initials}
						</AvatarFallback>
					</Avatar>
				</Link>
			</div>
		</header>
	);
}
