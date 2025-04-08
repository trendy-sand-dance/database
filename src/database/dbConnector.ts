import { PrismaClient } from "@prisma/client";
import fp from "fastify-plugin";
import { FastifyInstance } from 'fastify';

const prisma = new PrismaClient();

async function dbConnector(fastify: FastifyInstance) {

	await prisma.$connect();
	fastify.decorate("prisma", prisma);
	fastify.addHook("onClose", async () => {
		await prisma.$disconnect();
	});
};

export default fp(dbConnector);