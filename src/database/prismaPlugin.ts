//import { PrismaClient } from '@prisma/client';
//import fp from "fastify-plugin";
//import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

//async function prismaPlugin(fastify: FastifyInstance, request: FastifyRequest, reply: FastifyReply): Promise<void> {
//	const prisma = new PrismaClient();

//	await prisma.$connect();
//	fastify.get("/users", async(request, reply) => {
//		const {name, email} = request.body as { name: string; email: string };
//		const user = await prisma.user.create({ data: {name, email }});
//		reply.send(user);
//	});

//	fastify.decorate('prisma', prisma);

//	fastify.addHook('onClose', async (fastify) => {
//		await fastify.prisma.$disconnect();
//	});

//};

//export default prismaPlugin;

//import Fastify from "fastify";
//import { PrismaClient } from "@prisma/client";

//const fastify = Fastify({ logger: true });
//const prisma = new PrismaClient();

//// Get all users
//fastify.get("/users", async (_, reply) => {
//  const users = await prisma.user.findMany();
//  reply.send(users);
//});

//// Create a new user
//fastify.post("/users", async (request, reply) => {
//  const { name, email } = request.body as { name: string; email: string };
//  const user = await prisma.user.create({ data: { name, email } });
//  reply.send(user);
//});

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});