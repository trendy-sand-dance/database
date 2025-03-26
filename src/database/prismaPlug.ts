//import { PrismaClient } from '@prisma/client';
//import fp from "fastify-plugin";
//import { FastifyPluginAsync } from 'fastify';

//const prismaPlugin: FastifyPluginAsync = fp(async (server, options) => {
//	const prisma = new PrismaClient();

//	await prisma.$connect();

//	server.decorate('prisma', prisma);

//	server.addHook('onClose', async (server) => {
//		await server.prisma.$disconnect();
//	});

//});

//export default prismaPlugin;