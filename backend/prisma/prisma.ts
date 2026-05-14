import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function databaseUrl(): string {
	const fromEnv = process.env.DATABASE_URL?.trim();
	if (fromEnv) return fromEnv;
	return "file:./dev.db";
}

function createPrismaClient() {
	const adapter = new PrismaBetterSqlite3({ url: databaseUrl() });
	return new PrismaClient({ adapter });
}

export const prismaClient = globalForPrisma.prisma ?? createPrismaClient();

globalForPrisma.prisma = prismaClient;
