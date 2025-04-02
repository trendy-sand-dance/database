import { FastifyRequest, FastifyReply } from 'fastify';
import prisma from './prisma';

export async function getPrisma(request: FastifyRequest, reply: FastifyReply): Promise<void> {

	const users = await prisma.user.findMany();
	console.log("getting prisma");
	return reply.send(users);

};
