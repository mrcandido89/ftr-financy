import { useMutation } from "@apollo/client/react";
import { Eye, EyeOff, Loader2, Lock, LogIn, Mail, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { REGISTER } from "../lib/graphql/mutations/auth";
import { useAuthStore } from "../stores/auth";
import type { User as UserType } from "../types";

export function Signup() {
	const navigate = useNavigate();
	const setAuth = useAuthStore((state) => state.setAuth);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const [register, { loading }] = useMutation(REGISTER, {
		onCompleted: (data: { register: { user: UserType; token: string } }) => {
			setAuth(data.register.user, data.register.token);
			toast.success("Conta criada com sucesso!");
			navigate("/");
		},
		onError: (error) => {
			toast.error(error.message || "Erro ao criar conta");
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!name || !email || !password) {
			toast.error("Por favor, preencha todos os campos");
			return;
		}

		if (password.length < 8) {
			toast.error("A senha deve ter pelo menos 8 caracteres");
			return;
		}

		register({
			variables: {
				data: { name, email, password },
			},
		});
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9FA] p-4">
			<div className="mb-8 flex items-center gap-3">
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
			</div>

			<Card className="w-full max-w-md p-8">
				<div className="text-center mb-8">
					<h1 className="text-2xl font-semibold text-[#111827]">Criar conta</h1>
					<p className="text-sm text-[#6B7280]">
						Comece a controlar suas finanças ainda hoje
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-5">
					<div>
						<Label htmlFor="name" className="text-[#111827] mb-2 block">
							Nome completo
						</Label>
						<div className="relative">
							<User className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-[#6B7280]" />
							<Input
								id="name"
								type="text"
								placeholder="Seu nome completo"
								value={name}
								onChange={(e) => setName(e.target.value)}
								disabled={loading}
								className="pl-10"
							/>
						</div>
					</div>

					<div>
						<Label htmlFor="email" className="text-[#111827] mb-2 block">
							E-mail
						</Label>
						<div className="relative">
							<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-[#6B7280]" />
							<Input
								id="email"
								type="email"
								placeholder="mail@exemplo.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								disabled={loading}
								className="pl-10"
							/>
						</div>
					</div>

					<div>
						<Label htmlFor="password" className="text-[#111827] mb-2 block">
							Senha
						</Label>
						<div className="relative">
							<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-[#6B7280]" />
							<Input
								id="password"
								type={showPassword ? "text" : "password"}
								placeholder="Digite sua senha"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								disabled={loading}
								className="pl-10 pr-10"
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-1/2 transform -translate-y-1/2 size-4 text-[#6B7280] hover:text-[#111827]"
							>
								{showPassword ? (
									<EyeOff className="size-4" />
								) : (
									<Eye className="size-4" />
								)}
							</button>
						</div>
						<p className="text-xs text-[#6B7280] mt-1">
							A senha deve ter no mínimo 8 caracteres
						</p>
					</div>

					<Button
						type="submit"
						disabled={loading}
						className="w-full bg-[#1F6F43] hover:bg-[#1A5C37] text-white"
					>
						{loading ? (
							<>
								<Loader2 className="mr-2 size-4 animate-spin" />
								Criando conta...
							</>
						) : (
							"Cadastrar"
						)}
					</Button>

					<div className="relative my-6">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-[#E5E7EB]" />
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="px-4 bg-white text-[#6B7280]">ou</span>
						</div>
					</div>

					<div className="text-center">
						<p className="text-sm text-[#6B7280] mb-4">Já tem uma conta?</p>
						<Link to="/login">
							<Button
								type="button"
								variant="outline"
								className="w-full border-[#E5E7EB] text-[#111827] hover:bg-[#F8F9FA]"
							>
								<LogIn className="size-4 mr-2" />
								Fazer login
							</Button>
						</Link>
					</div>
				</form>
			</Card>
		</div>
	);
}
