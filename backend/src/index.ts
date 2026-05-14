import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const typeDefs = `
  type Query {
    helloWorld: String
  }
`;

async function bootstrap() {
	const server = new ApolloServer({
		typeDefs,
		resolvers: {
			Query: {
				helloWorld: () => {
					return "Hello World";
				},
			},
		},
	});

	const { url } = await startStandaloneServer(server, {
		listen: {
			port: 4000,
		},
	});

	console.log(`Servidor iniciado em ${url}`);
}

bootstrap();
