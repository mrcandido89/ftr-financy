import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import express from "express";
import { buildSchema } from "type-graphql";

async function bootstrap() {
	const app = express();

	const schema = await buildSchema({
		resolvers: [],
		validate: false,
		emitSchemaFile: "./schema.graphql",
	});

	const server = new ApolloServer({
		schema,
	});

	await server.start();

	app.use("/graphql", express.json(), expressMiddleware(server));

	app.listen(
		{
			port: 4000,
		},
		() => {
			console.log("Servidor iniciado na porta 4000.");
		},
	);
}

bootstrap();
