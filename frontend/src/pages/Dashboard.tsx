import { useQuery } from "@apollo/client/react";
import {
	AlertCircle,
	ArrowDownCircle,
	ArrowUpCircle,
	Briefcase,
	CarFront,
	ChevronRight,
	Loader2,
	PiggyBank,
	Plus,
	ShoppingCart,
	Utensils,
	Wallet,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import { TransactionModal } from "../components/TransactionModal";
import { Card } from "../components/ui/card";
import { LIST_CATEGORIES } from "../lib/graphql/queries/categories";
import { LIST_TRANSACTIONS } from "../lib/graphql/queries/transactions";
import { cn, formatCurrency, formatDate } from "../lib/utils";
import type { Category, PaginatedTransactions, Transaction } from "../types";

const iconMap: Record<string, React.ElementType> = {
	"briefcase-business": Briefcase,
	utensils: Utensils,
	"car-front": CarFront,
	"shopping-cart": ShoppingCart,
	"piggy-bank": PiggyBank,
};

export function Dashboard() {
	const [createOpen, setCreateOpen] = useState(false);

	const {
		data: transactionsData,
		loading: transactionsLoading,
		error: transactionsError,
		refetch,
	} = useQuery(LIST_TRANSACTIONS);

	const { data: categoriesData } = useQuery(LIST_CATEGORIES);

	if (transactionsLoading) {
		return (
			<Layout>
				<div className="flex items-center justify-center min-h-[60vh]">
					<Loader2 className="size-8 animate-spin text-[#1F6F43]" />
				</div>
			</Layout>
		);
	}

	if (transactionsError) {
		return (
			<Layout>
				<div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
					<AlertCircle className="size-12 text-destructive mb-4" />
					<h2>Erro ao carregar os dados</h2>
					<p>{transactionsError.message}</p>
				</div>
			</Layout>
		);
	}

	const paginatedData = (
		transactionsData as { listTransactions: PaginatedTransactions } | undefined
	)?.listTransactions;
	const transactions: Transaction[] = paginatedData?.transactions || [];
	const categories: Category[] =
		(categoriesData as { listCategories: Category[] } | undefined)
			?.listCategories || [];

	const currentMonth = new Date().getMonth();
	const currentYear = new Date().getFullYear();

	const monthTransactions = transactions.filter((transaction) => {
		const date = new Date(transaction.date);
		return (
			date.getMonth() === currentMonth && date.getFullYear() === currentYear
		);
	});

	const monthIncome = monthTransactions
		.filter((transaction) => transaction.type === "income")
		.reduce((acc, transaction) => acc + transaction.amount, 0);

	const monthExpense = monthTransactions
		.filter((transaction) => transaction.type === "expense")
		.reduce((acc, transaction) => acc + transaction.amount, 0);

	const balance = monthIncome - monthExpense;

	const recentTransactions = transactions.slice(0, 5);

	const categoryStats = categories
		.map((category) => {
			const categoryTransactions = transactions.filter(
				(transaction) => transaction.categoryId === category.id,
			);
			const total = categoryTransactions.reduce(
				(acc, transaction) => acc + transaction.amount,
				0,
			);

			return {
				...category,
				count: categoryTransactions.length,
				total,
			};
		})
		.slice(0, 5);

	return (
		<Layout>
			<div>
				<div className="grid grid-cols-[2fr_1fr] gap-6 mb-6">
					<div className="grid grid-cols-2 gap-6">
						<Card className="p-6 flex flex-col gap-4">
							<div className="flex items-center gap-3">
								<Wallet className="size-5 text-[#9333EA]" />
								<span className="text-xs font-medium text-[#6B7280] uppercase tracking-wider">
									Saldo total
								</span>
							</div>
							<h2 className="text-[28px] font-bold text-[#111827]">
								{formatCurrency(balance)}
							</h2>
						</Card>

						<Card className="p-6 flex flex-col gap-4">
							<div className="flex items-center gap-3">
								<ArrowUpCircle className="size-5 text-[#1F6F43]" />
								<span className="text-xs font-medium text-[#6B7280] uppercase tracking-wider">
									Receitas do mês
								</span>
							</div>
							<h2 className="text-[28px] font-bold text-[#111827]">
								{formatCurrency(monthIncome)}
							</h2>
						</Card>
					</div>

					<Card className="p-6 flex flex-col gap-4">
						<div className="flex items-center gap-3">
							<ArrowDownCircle className="size-5 text-[#DC2626]" />
							<span className="text-xs font-medium text-[#6B7280] uppercase tracking-wider">
								Despesas do mês
							</span>
						</div>
						<h2 className="text-[28px] font-bold text-[#111827]">
							{formatCurrency(monthExpense)}
						</h2>
					</Card>
				</div>

				<div className="grid grid-cols-[2fr_1fr] gap-6">
					<Card className="overflow-hidden">
						<div className="border-b border-[#E5E7EB] px-6 py-5 flex items-center justify-between">
							<span className="text-xs font-medium text-[#6B7280] uppercase tracking-wider">
								Transações recentes
							</span>
							<Link
								to="/transactions"
								className="flex items-center gap-1 text-sm font-medium text-[#1F6F43] hover:underline"
							>
								Ver todas
								<ChevronRight className="size-5" />
							</Link>
						</div>

						<div>
							{recentTransactions.length === 0 ? (
								<div className="flex flex-col items-center justify-center py-12 text-center">
									<ArrowUpCircle className="size-12 text-muted-foreground mb-4" />
									<p className="text-lg font-medium mb-2">
										Nenhuma transação encontrada
									</p>
									<p className="text-sm text-muted-foreground">
										Comece adicionando sua primeira transação
									</p>
								</div>
							) : (
								<>
									{recentTransactions.map((transaction) => {
										const Icon =
											transaction.type === "income" ? Briefcase : Utensils;
										const bgColor =
											transaction.type === "income"
												? "bg-[#E0FAE9]"
												: "bg-[#DBEAFE]";
										const iconColor =
											transaction.type === "income"
												? "text-[#16A34A]"
												: "text-[#2563EB]";

										return (
											<div
												key={transaction.id}
												className="border-b border-[#E5E7EB] flex items-center"
											>
												<div className="flex-1 flex items-center gap-4 px-6 py-5">
													<div
														className={cn(
															"size-10 rounded-lg flex items-center justify-center",
															bgColor,
														)}
													>
														<Icon className={cn("size-4", iconColor)} />
													</div>
													<div className="flex-1">
														<h3 className="font-medium text-[#111827]">
															{transaction.title}
														</h3>
														<p className="text-sm text-[#4B5563]">
															{formatDate(transaction.date)}
														</p>
													</div>
												</div>

												<div className="w-40 px-6 py-5 flex justify-center">
													{transaction.category && (
														<span
															className="px-3 py-1 rounded-full text-sm font-medium"
															style={{
																backgroundColor:
																	transaction.category.color + "20",
																color: transaction.category.color,
															}}
														>
															{transaction.type === "income"
																? "Receita"
																: transaction.category.name}
														</span>
													)}
													{!transaction.category &&
														transaction.type === "income" && (
															<span className="px-3 py-1 rounded-full text-sm font-medium bg-[#e0fae9] text-[#15803D]">
																Receita
															</span>
														)}
												</div>

												<div className="w-40 px-6 py-5 flex items-center justify-end gap-2">
													<span className="font-semibold text-sm text-[#111827]">
														{transaction.type === "income" ? "+" : "-"}{" "}
														{formatCurrency(transaction.amount)}
													</span>
													{transaction.type === "income" ? (
														<ArrowUpCircle className="h-4 w-4 text-[#1F6F43]" />
													) : (
														<ArrowDownCircle className="h-4 w-4 text-[#DC2626]" />
													)}
												</div>
											</div>
										);
									})}
								</>
							)}
						</div>

						<div className="border-t border-[#E5E7EB] px-6 py-5 flex items-center justify-center">
							<button
								onClick={() => setCreateOpen(true)}
								className="flex items-center gap-2 text-sm font-medium text-[#1F6F43] hover:underline"
							>
								<Plus className="h-5 w-5" />
								Nova transação
							</button>
						</div>
					</Card>

					<Card className="overflow-hidden">
						<div className="border-b border-[#E5E7EB] px-6 py-5 flex items-center justify-between">
							<span className="text-xs font-medium text-[#6B7280] uppercase tracking-wider">
								Categorias
							</span>
							<Link
								to="/categories"
								className="flex items-center gap-1 text-sm font-medium text-[#1F6F43] hover:underline"
							>
								Gerenciar
								<ChevronRight className="h-5 w-5" />
							</Link>
						</div>

						<div className="p-6 space-y-5">
							{categoryStats.length === 0 ? (
								<div className="flex flex-col items-center justify-center py-8 text-center">
									<p className="text-sm text-muted-foreground">
										Nenhuma categoria encontrada
									</p>
								</div>
							) : (
								categoryStats.map((cat) => (
									<div key={cat.id} className="flex items-center gap-1">
										<span
											className="px-3 py-1 rounded-full text-sm font-medium shrink-0"
											style={{
												backgroundColor: cat.color + "20",
												color: cat.color,
											}}
										>
											{cat.name}
										</span>
										<span className="flex-1 text-sm text-[#4B5563] text-right">
											{cat.count} {cat.count === 1 ? "item" : "itens"}
										</span>
										<span className="w-[88px] text-sm font-semibold text-[#111827] text-right">
											{formatCurrency(cat.total)}
										</span>
									</div>
								))
							)}
						</div>
					</Card>
				</div>
			</div>

			<TransactionModal
				open={createOpen}
				onOpenChange={setCreateOpen}
				onSuccess={refetch}
			/>
		</Layout>
	);
}
